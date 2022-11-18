import { collection, query, where, getDocs } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, ReactNode } from 'react';

import { HowManyDaysToLimitPlaceUpserts } from 'spelieve-common/lib/Consts/Place';
import {
	MPlaceOneInterface,
	MPlaceOneValInterface,
	MPlaceOpeningHoursInterface,
	UpsertPlaceDataBodyInterface,
} from 'spelieve-common/lib/Interfaces/Place';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import i18n from '@/Common/Hooks/i18n-js';
import db from '@/Place/Endpoint/firestore';
import { PlaceHttpPost } from '@/Place/Endpoint/PlaceHttpPost';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const PCT012MPlaceOne = createContext({} as MPlaceOneValInterface);

export const PCT012MPlaceOneProvider = ({ children }: { children: ReactNode }) => {
	const [place, setPlace] = useState<MPlaceOneInterface | undefined>();
	const [placeID, setPlaceID] = useState<string | undefined>();
	const collectionRef = useMemo(() => collection(db, MPlace.modelName), []);
	const language = useMemo(() => GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale], []);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!placeID || !language) {
			return;
		}
		setIsLoading(true);

		const fetchData = async () => {
			const q = query(
				collectionRef,
				where(MPlace.Cols.place_id, '==', placeID),
				where(MPlace.Cols.language, '==', language),
			).withConverter(
				FirestoreConverter<MPlace, MPlaceOneInterface>(
					MPlace,
					(data) => {
						const displayOpeningHours = (
							openingHours: MPlaceOpeningHoursInterface[] | undefined,
						): string | Array<[string, string]> => {
							if (!openingHours) {
								return i18n.t('No Opening Hours Infomation');
							}

							if (openingHours.length === 1 && !openingHours[0].close) {
								return i18n.t('Open 24hours');
							}

							const days: { [key: number]: string } = {
								0: 'Sunday',
								1: 'Monday',
								2: 'Tuesday',
								3: 'Wednesday',
								4: 'Thursday',
								5: 'Friday',
								6: 'Saturday',
							};
							const changeTimeView = (time: string): string => {
								// 1300->13:00
								const hours = time.slice(0, 2);
								const minutes = time.slice(2, 4);
								return `${hours}:${minutes}`;
							};
							return openingHours.map((openingHour) => {
								const { open } = openingHour;
								const { close } = openingHour;
								const day = days[open.day];
								const time = `${changeTimeView(open.time)}~${changeTimeView(close.time)}`;
								return [i18n.t(day), time];
							});
						};
						return {
							...data,
							openingHours: displayOpeningHours(data.openingHours),
						};
					},
					(data) => data,
				),
			);
			let querySnap = await getDocs(q);
			if (
				querySnap.empty ||
				new Date().getDate() - querySnap.docs[0].data().updatedAt.getDate() > HowManyDaysToLimitPlaceUpserts
			) {
				await PlaceHttpPost<UpsertPlaceDataBodyInterface, undefined>('PBL002', { place_id: placeID, language }).catch(
					() => {
						setPlace(undefined);
						setIsLoading(false);
					},
				);
				if (!isLoading) {
					return;
				}
				querySnap = await getDocs(q);
			}
			setPlace(querySnap.docs[0].data());
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [collectionRef, placeID, language, isLoading]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const value: MPlaceOneValInterface = {
		place,
		setPlaceID,
		isLoading,
	};
	return <PCT012MPlaceOne.Provider value={value}>{children}</PCT012MPlaceOne.Provider>;
};
