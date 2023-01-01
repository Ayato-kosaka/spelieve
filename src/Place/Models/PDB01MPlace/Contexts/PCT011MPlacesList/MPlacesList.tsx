import {
	collection,
	query,
	where,
	getDocs,
	orderBy,
	Query,
	QueryConstraint,
	startAfter,
	limit,
	DocumentSnapshot,
} from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode, useMemo, useCallback } from 'react';

import { DisplayNumberOfPlaces } from 'spelieve-common/lib/Consts/Place';
import {
	MPlacesListInterface,
	MPlacesListValInterface,
	MPlacesListAddressInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import i18n from '@/Common/Hooks/i18n-js';
import db from '@/Place/Endpoint/firestore';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const PCT011MPlacesList = createContext({} as MPlacesListValInterface);

export const PCT011MPlacesListProvider = ({ children }: { children: ReactNode }) => {
	const placeCollectionRef = useMemo(() => collection(db, MPlace.modelName), []);
	const [placesList, setPlacesList] = useState<MPlacesListInterface[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [address, setAddress] = useState<MPlacesListAddressInterface>({});
	const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);

	const basicQueryConstraints = useMemo(() => {
		const qc: QueryConstraint[] = [];

		qc.push(where(MPlace.Cols.language, '==', GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale]));

		qc.push(where(MPlace.Cols.country, '==', address.country));

		if (address.administrativeAreaLevel1) {
			qc.push(where(MPlace.Cols.administrativeAreaLevel1, '==', address.administrativeAreaLevel1));
		}

		if (address.administrativeAreaLevel2) {
			qc.push(where(MPlace.Cols.administrativeAreaLevel2, '==', address.administrativeAreaLevel2));
		}

		if (address.locality) {
			qc.push(where(MPlace.Cols.locality, '==', address.locality));
		}

		qc.push(orderBy(MPlace.Cols.rating, 'desc'));
		qc.push(limit(DisplayNumberOfPlaces));
		return qc;
	}, [address]);

	const fetchSetPlaces = async (q: Query<MPlacesListInterface>, currentPlacesList: MPlacesListInterface[]) => {
		await getDocs(q)
			.then((querySnapshot) => {
				setPlacesList([...currentPlacesList, ...querySnapshot.docs.map((doc) => doc.data())]);
				setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
				setIsLoading(false);
			})
			.catch((e) => {
				console.log(e); // eslint-disable-line no-console
			});
	};

	const toQuery = useCallback(
		(qc: QueryConstraint[]): Query<MPlacesListInterface> =>
			query(placeCollectionRef, ...qc).withConverter(
				FirestoreConverter<MPlace, MPlacesListInterface>(
					MPlace,
					(data) => data,
					(data) => data,
				),
			),
		[placeCollectionRef],
	);

	const retrieveMore = useCallback(() => {
		setIsLoading(true);
		const queryConstraints: QueryConstraint[] = [...basicQueryConstraints, startAfter(lastVisible)];
		const q: Query<MPlacesListInterface> = toQuery(queryConstraints);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchSetPlaces(q, placesList);
	}, [basicQueryConstraints, lastVisible, placesList, toQuery]);

	useEffect(() => {
		if (!address.country) {
			return;
		}
		setIsLoading(true);
		const q: Query<MPlacesListInterface> = toQuery(basicQueryConstraints);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchSetPlaces(q, []);
	}, [address, basicQueryConstraints, toQuery]);

	const value: MPlacesListValInterface = useMemo(
		() => ({
			placesList,
			setAddress,
			retrieveMore,
			isLoading,
		}),
		[placesList, setAddress, retrieveMore, isLoading],
	);
	return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>;
};
