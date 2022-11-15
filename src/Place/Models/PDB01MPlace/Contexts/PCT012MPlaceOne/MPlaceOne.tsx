import { collection, query, where, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo } from 'react';

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
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';
import i18n from '@/Common/Hooks/i18n-js';

export const PCT012MPlaceOne = createContext({} as MPlaceOneValInterface);

export const PCT012MPlaceOneProvider = ({
	children,
}: MPlaceOneProviderPropsInterface) => {
	const [place, setPlace] = useState<MPlaceOneInterface | null>(null);
	const [place_id, setPlaceId] = useState<string | undefined>();
	const collectionRef = useMemo(() => collection(db, MPlace.modelName), []);
	const language = useMemo(() => GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale], []);

	useEffect(() => {
		if (!place_id || !language) {
			return;
		}
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
				new Date().getDate() - querySnap.docs[0].data().updatedAt.getDate() > HowManyDaysToLimitPlaceUpserts
			) {
				await PlaceHttpPost<UpsertPlaceDataBodyInterface, never>('PBL002', { place_id, language });
				querySnap = await getDocs(q);
			}
			setPlace(querySnap.docs[0].data());
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [collectionRef, place_id, language]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const value: MPlaceOneValInterface = {
		place,
		setPlaceId,
	};
	return <PCT012MPlaceOne.Provider value={value}>{children}</PCT012MPlaceOne.Provider>;
};
