import { collection, query, where, getDocs, orderBy, Query, QueryConstraint, startAfter, limit, DocumentSnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useState, createContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	MPlacesListInterface,
	MPlacesListValInterface,
	MPlacesListProviderPropsInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import db from '@/Place/Endpoint/firestore';

export const PCT011MPlacesList = createContext({} as MPlacesListValInterface);

export function PCT011MPlacesListProvider({
	parentDocRef,
	children,
	initialCountry,
	initialAdministrativeAreaLevel1,
	initialAdministrativeAreaLevel2,
	initialLocality,
}: MPlacesListProviderPropsInterface) {
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
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [searchedAddress, setSearchedAddress] = useState(initialAddress);
	const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

	const createBasicQueryConstraint = (): QueryConstraint[] => {
		// const collectionRef = parentDocRef
		//         ? collection(parentDocRef, MPlace.modelName).withConverter(PCT011MPlacesListConverter())
		//         : collection(db, MPlace.modelName).withConverter(PCT011MPlacesListConverter());
		const qc: QueryConstraint[] = [];
		qc.push(where(MPlace.Cols.country, '==', searchedAddress.country));

		if (searchedAddress.administrativeAreaLevel1 !== '') {// index済
			qc.push(where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1));
		}

		if (searchedAddress.administrativeAreaLevel2 !== '') {
			qc.push(where(MPlace.Cols.administrativeAreaLevel2, '==', searchedAddress.administrativeAreaLevel2));
		}

		if (searchedAddress.locality !== '') {// index済
			qc.push(where(MPlace.Cols.locality, '==', searchedAddress.locality));
		}

		qc.push(orderBy(MPlace.Cols.rating, 'desc'));
		return qc;
	};

	const fetchUpPlaces = async (q: Query) => {
		const places: MPlacesListInterface[] = [];
		let lastDoc: DocumentSnapshot;
		await getDocs(q)
			.then((querySnapshot) => {
				if (!querySnapshot.empty) {
					const docSize = querySnapshot.size;
					querySnapshot.forEach((doc, index) => {
						if (index == docSize-1) {
							lastDoc = doc;
						}
						places.push(doc.data() as MPlacesListInterface);
					});
				}
			})
			.catch((e) => {
				console.log(e);
			});
		setLastVisible(lastDoc);
		setPlacesList([...placesList, ...places]);
	};

	const retrieveMore = async () => {
		setIsRefreshing(true);
		let qc: QueryConstraint[] = createBasicQueryConstraint();
		qc.push(startAfter(lastVisible));
		qc.push(limit(10));
		const q: Query = query(placeCollectionRef, ...qc);
		try {
			await fetchUpPlaces(q);
			setIsRefreshing(false);
		} catch(e) {
			console.log(e);
		}
	}

	useEffect(() => {
		const qc: QueryConstraint[] = createBasicQueryConstraint();
		qc.push(limit(10));
		const q: Query = query(placeCollectionRef, ...qc);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchUpPlaces(q);
		setIsLoading(false);
	}, [searchedAddress]);

	if (isLoading) {
	    return <ActivityIndicator animating />
	}

	const value: MPlacesListValInterface = {
		placesList,
		setSearchedAddress,
		retrieveMore,
	};
	return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>;
}
