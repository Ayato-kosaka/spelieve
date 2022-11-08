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
import { useState, createContext, useEffect } from 'react';


import {
	MPlacesListInterface,
	MPlacesListValInterface,
	MPlacesListAddressInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import db from '@/Place/Endpoint/firestore';

export const PCT011MPlacesList = createContext({} as MPlacesListValInterface);

export const PCT011MPlacesListProvider = ({ children }) => {
	const placeCollectionRef = collection(db, MPlace.modelName);
	const [placesList, setPlacesList] = useState<MPlacesListInterface[]>([]);
	const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
	const [address, setAddress] = useState<MPlacesListAddressInterface>({});
	const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

	const createBasicQueryConstraint = (): QueryConstraint[] => {
		const qc: QueryConstraint[] = [];
		qc.push(where(MPlace.Cols.country, '==', address.country));

		if (address.administrativeAreaLevel1 !== '') {
			// index済
			qc.push(where(MPlace.Cols.administrativeAreaLevel1, '==', address.administrativeAreaLevel1));
		}

		if (address.administrativeAreaLevel2 !== '') {
			qc.push(where(MPlace.Cols.administrativeAreaLevel2, '==', address.administrativeAreaLevel2));
		}

		if (address.locality !== '') {
			// index済
			qc.push(where(MPlace.Cols.locality, '==', address.locality));
		}

		qc.push(orderBy(MPlace.Cols.rating, 'desc'));
		return qc;
	};

	const fetchSetPlaces = async (q: Query<MPlacesListInterface>, currentPlacesList: MPlacesListInterface[]) => {
		await getDocs(q)
			.then((querySnapshot) => {
				setPlacesList([...currentPlacesList, ...querySnapshot.docs.map((doc) => doc.data())]);
				setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const toQuery = (qc: QueryConstraint[]): Query<MPlacesListInterface> =>
		query(placeCollectionRef, ...qc).withConverter(
			FirestoreConverter<MPlace, MPlacesListInterface>(
				MPlace,
				(data) => data,
				(data) => data,
			),
		);

	const retrieveMore = async () => {
		setIsRefreshing(true);
		const qc: QueryConstraint[] = createBasicQueryConstraint();
		qc.push(startAfter(lastVisible));
		qc.push(limit(10));
		const q: Query<MPlacesListInterface> = toQuery(qc);
		try {
			await fetchSetPlaces(q, placesList);
		} catch (e) {
			console.log(e);
		}
		setIsRefreshing(false);
	};

	useEffect(() => {
		if (!address.country) {
			return;
		}

		console.log("aaa: ", address.country, address.administrativeAreaLevel1, address.administrativeAreaLevel2, address.locality)
		setIsFirstLoading(true);
		const qc: QueryConstraint[] = createBasicQueryConstraint();
		qc.push(limit(10));
		const q: Query<MPlacesListInterface> = toQuery(qc);

		const fetchFirstPlaces = async () => {
			await fetchSetPlaces(q, []);
			setIsFirstLoading(false);
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchFirstPlaces();
	}, [address]);

	const value: MPlacesListValInterface = {
		placesList,
		setAddress,
		retrieveMore,
		isFirstLoading,
	};
	return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>;
};
