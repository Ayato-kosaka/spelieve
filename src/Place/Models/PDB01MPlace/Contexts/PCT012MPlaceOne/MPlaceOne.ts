import { onSnapshot, DocumentSnapshot, addDoc, getDoc } from 'firebase/firestore';
import { useState, createContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	MPlaceOneInterface,
	MPlaceOneProviderPropsInterface,
	MPlaceOneValInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace} from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';
import {HowManyDaysToLimitPlaceUpserts} from 'spelieve-common/lib/Consts/Place'

export const PCT012MPlaceOne = createContext({} as MPlaceOneValInterface);

export function PCT012MPlaceOneProvider({ docRef, children }: MPlaceOneProviderPropsInterface) {
	const [place, setPlace] = useState<MPlaceOneInterface | null>(null);

	useEffect(() => {
    const fetchData = async () => {
      const doc = await getDoc(docRef.withConverter(
				FirestoreConverter<MPlace, MPlaceOneInterface>(
					MPlace,
					(data) => data,
					(data) => data,
				),
			));
      setPlace(doc.data());
    }
    if(docRef){
      fetchData()
    }

    if(!docRef ||  place && new Date().getDate() - place.updatedAt.getDate() < HowManyDaysToLimitPlaceUpserts){
      
    }
	}, [docRef]);

	if (!place) {
		return <ActivityIndicator animating />;
	}

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: MPlaceOneValInterface = {
		place,
	};
	return <PCT012MPlaceOne.Provider value={value}>{children}</PCT012MPlaceOne.Provider>;
}