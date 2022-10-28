import {
	collection,
	query,
	where,
	getDocs,
	orderBy,
	Query,
    QueryConstraint,
} from 'firebase/firestore';
import { useState, createContext, useEffect } from 'react';

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
	const [placesList, setPlacesList] = useState<MPlacesListInterface[]>([]);
	const [searchedAddress, setSearchedAddress] = useState(initialAddress);
	// console.log(placesList);
	console.log(searchedAddress);

	useEffect(() => {
		const createPlaceQuery = (): Query => {
			// const collectionRef = parentDocRef
			//         ? collection(parentDocRef, MPlace.modelName).withConverter(PCT011MPlacesListConverter())
			//         : collection(db, MPlace.modelName).withConverter(PCT011MPlacesListConverter());
			const qc: QueryConstraint[] = [];
            qc.push(where(MPlace.Cols.country, '==', searchedAddress.country));
			
			if (searchedAddress.administrativeAreaLevel1 !== '') {
				// index済
				qc.push(where(MPlace.Cols.administrativeAreaLevel1, '==', searchedAddress.administrativeAreaLevel1))
			}
			
			if (searchedAddress.administrativeAreaLevel2 !== '') {
				qc.push(where(MPlace.Cols.administrativeAreaLevel2, '==', searchedAddress.administrativeAreaLevel2))
			}
			
			if (searchedAddress.locality !== '') {
				// index済
				qc.push(where(MPlace.Cols.locality, '==', searchedAddress.locality))
			}
			
			qc.push(orderBy(MPlace.Cols.rating, 'desc'))
			const placeCollectionRef = collection(db, MPlace.modelName); // .withConverter(PCT011MPlacesListConverter());

			return query(placeCollectionRef, ...qc);
		};

		const fetchUpData = async (q: Query) => {
			const querySnapshot = await getDocs(q);
			const places: MPlacesListInterface[] = [];
			querySnapshot.forEach((doc) => {
				places.push(doc.data() as MPlacesListInterface);
			});
			setPlacesList(places);
		};

		const q: Query = createPlaceQuery();
		fetchUpData(q);
	}, [searchedAddress]);

    // const retrieveMore = async () => {
    //     // setRefreshing(true);

    //     // Cloud Firestore: Query (Additional Query)
    //     const placeCollectionRef = collection(db, MPlace.modelName)
    //     let additionalQuery = query(
    //         placeCollectionRef,
    //         where('id', '<=', 20),
    //         orderBy('id'),
    //         startAfter(this.state.lastVisible),
    //         limit(10),

    // }


	// if (placesList.length == 0) {
	//     return <ActivityIndicator animating />
	// }

	const value: MPlacesListValInterface = {
		placesList,
		setSearchedAddress,
	};
	return <PCT011MPlacesList.Provider value={value}>{children}</PCT011MPlacesList.Provider>;
}
