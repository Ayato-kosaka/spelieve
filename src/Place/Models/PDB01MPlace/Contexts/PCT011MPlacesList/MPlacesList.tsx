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
import { ActivityIndicator } from 'react-native-paper';

import {
	MPlacesListInterface,
	MPlacesListValInterface,
	MPlacesListProviderPropsInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import db from '@/Place/Endpoint/firestore';

export const PCT011MPlacesList = createContext({} as MPlacesListValInterface);

export const PCT011MPlacesListProvider = ({
	parentDocRef,
	children,
	initialCountry,
	initialAdministrativeAreaLevel1,
	initialAdministrativeAreaLevel2,
	initialLocality,
}: MPlacesListProviderPropsInterface) => {
	const initialAddress = {
		country: initialCountry,
		administrativeAreaLevel1: initialAdministrativeAreaLevel1,
		administrativeAreaLevel2: initialAdministrativeAreaLevel2,
		locality: initialLocality,
	};
	const placeCollectionRef = parentDocRef
		? collection(parentDocRef, MPlace.modelName)
		: collection(db, MPlace.modelName);
	const [placesList, setPlacesList] = useState<MPlacesListInterface[]>([]);
	const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
	const [searchedAddress, setSearchedAddress] = useState(initialAddress);
	const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	
	const createBasicQueryConstraint = (): QueryConstraint[] => {
		const qc: QueryConstraint[] = [];
		qc.push(where(MPlace.Cols.country, '==', searchedAddress.country));

		if (searchedAddress.administrativeAreaLevel1 !== '') {
			// index済
			qc.push(where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1));
		}

		if (searchedAddress.administrativeAreaLevel2 !== '') {
			qc.push(where(MPlace.Cols.administrativeAreaLevel2, '==', searchedAddress.administrativeAreaLevel2));
		}

		if (searchedAddress.locality !== '') {
			// index済
			qc.push(where(MPlace.Cols.locality, '==', searchedAddress.locality));
		}

		qc.push(orderBy(MPlace.Cols.rating, 'desc'));
		return qc;
	};

	const fetchSetPlaces = async (query: Query<MPlacesListInterface>, currentPlacesList) => {
		await getDocs(query)
			.then((querySnapshot) => {
				setPlacesList([
					...currentPlacesList,
					...querySnapshot.docs.map((doc) => doc.data()),
				]);
				setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1]);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const toQuery = (qc: QueryConstraint[]): Query<MPlacesListInterface> => query(placeCollectionRef, ...qc).withConverter(
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
		const fetchFirstPlaces = async () => {
			await fetchSetPlaces(q, []);
			setIsFirstLoading(false);
		}
		setIsFirstLoading(true);
		const qc: QueryConstraint[] = createBasicQueryConstraint();
		qc.push(limit(10));
		const q: Query<MPlacesListInterface> = toQuery(qc);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchFirstPlaces();
	}, [searchedAddress]);

	if (isFirstLoading) {
		return <ActivityIndicator animating />;
	}

	const value: MPlacesListValInterface = {
		placesList,
		setSearchedAddress,
		retrieveMore,
		setIsFirstLoading,
	};
	return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>;
}
