import { collection, query, where, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { HowManyDaysToLimitPlaceUpserts } from 'spelieve-common/lib/Consts/Place';
import {
	MPlaceOneInterface,
	MPlaceOneProviderPropsInterface,
	MPlaceOneValInterface,
	UpsertPlaceDataBodyInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import db from '@/Place/Endpoint/firestore';
import { PlaceHttpPost } from '@/Place/Endpoint/PlaceHttpPost';

export const PCT012MPlaceOne = createContext({} as MPlaceOneValInterface);

export function PCT012MPlaceOneProvider({
	parentDocRef,
	place_id,
	language,
	children,
}: MPlaceOneProviderPropsInterface) {
	const [place, setPlace] = useState<MPlaceOneInterface | null>(null);

	const collectionRef = useMemo(() => {
		if (parentDocRef) {
			return collection(parentDocRef, MPlace.modelName);
		}
		return collection(db, MPlace.modelName);
	}, [parentDocRef]);

	useEffect(() => {
		const fetchData = async () => {
			const q = query(
				collectionRef,
				where(MPlace.Cols.place_id, '==', place_id),
				where(MPlace.Cols.language, '==', language),
			).withConverter(
				FirestoreConverter<MPlace, MPlaceOneInterface>(
					MPlace,
					(data) => data,
					(data) => data,
				),
			);
			let querySnap = await getDocs(q);
			if (
				querySnap.empty ||
				new Date().getDate() - querySnap.docs[0].data().updatedAt.getDate() < HowManyDaysToLimitPlaceUpserts
			) {
				await PlaceHttpPost<UpsertPlaceDataBodyInterface, never>('PBL002', { place_id, language });
				querySnap = await getDocs(q);
			}
			setPlace(querySnap.docs[0].data());
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [collectionRef, place_id, language]);

	if (!place) {
		return <ActivityIndicator animating />;
	}

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const value: MPlaceOneValInterface = {
		place,
	};
	return <PCT012MPlaceOne.Provider value={value}>{children}</PCT012MPlaceOne.Provider>;
}
