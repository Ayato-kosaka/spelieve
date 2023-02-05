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
		setPlace(undefined);
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
								0: i18n.t('Sunday'),
								1: i18n.t('Monday'),
								2: i18n.t('Tuesday'),
								3: i18n.t('Wednesday'),
								4: i18n.t('Thursday'),
								5: i18n.t('Friday'),
								6: i18n.t('Saturday'),
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
					// Place では update 処理をフロントで行わないため、toModelは実装しない
					(data) => data as unknown as MPlace,
				),
			);
			let querySnap = await getDocs(q);
			if (
				querySnap.empty ||
				new Date().getDate() - querySnap.docs[0].data().updatedAt.getDate() > HowManyDaysToLimitPlaceUpserts
			) {
				await PlaceHttpPost<UpsertPlaceDataBodyInterface, undefined>('PBL002', { place_id: placeID, language })
					.then(async () => {
						querySnap = await getDocs(q);
					})
					.catch(() => {
						setPlaceID(undefined);
						setIsLoading(false);
					});
			}
			setPlace(querySnap.docs[0].data());
			setIsLoading(false);
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchData();
	}, [collectionRef, placeID, language]);

	const value = useMemo(
		() => ({
			place,
			setPlaceID,
			isLoading,
		}),
		[isLoading, place],
	);
	return <PCT012MPlaceOne.Provider value={value}>{children}</PCT012MPlaceOne.Provider>;
};
