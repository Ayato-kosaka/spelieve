import { collection, query, onSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, useContext, ReactNode } from 'react';

import { PlansMapInterface, PlansMapValInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

export const ICT031PlansMap = createContext({} as PlansMapValInterface);

export const ICT031PlansMapProvider = ({ children }: { children: ReactNode }) => {
	const [plansDocSnapMap, setDocumentSnapshots] = useState<PlansMapValInterface['plansDocSnapMap']>({});
	const [isPlansLoading, setIsPlansLoading] = useState<boolean>(true);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);

	// Hooks では、google.maps のEnumを参照出来ないため、Context で定義する
	const travelModeConverter: {
		[key in google.maps.TravelMode]: {
			iconName: string;
			title: string;
		};
	} = useMemo(
		() => ({
			[google.maps.TravelMode.BICYCLING]: {
				iconName: 'bicycle',
				title: i18n.t('Bicycling'),
			},
			[google.maps.TravelMode.DRIVING]: {
				iconName: 'car',
				title: i18n.t('Driving'),
			},
			[google.maps.TravelMode.TRANSIT]: {
				iconName: 'subway-variant',
				title: i18n.t('Transit'),
			},
			[google.maps.TravelMode.TWO_WHEELER]: {
				iconName: 'atv',
				title: i18n.t('Two wheeler'),
			},
			[google.maps.TravelMode.WALKING]: {
				iconName: 'walk',
				title: i18n.t('Walking'),
			},
		}),
		[],
	);

	const transitModeConverter: {
		[key in google.maps.TransitMode]: {
			iconName: string;
			title: string;
		};
	} = useMemo(
		() => ({
			[google.maps.TransitMode.BUS]: {
				iconName: 'bus',
				title: i18n.t('Bus'),
			},
			[google.maps.TransitMode.RAIL]: {
				iconName: 'train-variant',
				title: i18n.t('Rail'),
			},
			[google.maps.TransitMode.SUBWAY]: {
				iconName: 'subway',
				title: i18n.t('Subway'),
			},
			[google.maps.TransitMode.TRAIN]: {
				iconName: 'train',
				title: i18n.t('Train'),
			},
			[google.maps.TransitMode.TRAM]: {
				iconName: 'tram',
				title: i18n.t('Tram'),
			},
		}),
		[],
	);

	const plansCRef = useMemo(() => {
		if (itineraryDocSnap) {
			return collection(itineraryDocSnap.ref, Plans.modelName).withConverter(
				FirestoreConverter<Plans, PlansMapInterface>(
					Plans,
					(data) => ({
						...data,
						transportationMode: (Object.keys(travelModeConverter) as google.maps.TravelMode[]).find(
							(travelMode) => travelMode === data.transportationMode,
						),
						transitModes: data.transitModes
							.map((e) => (Object.keys(transitModeConverter) as google.maps.TransitMode[]).find((item) => e === item))
							.filter((item): item is google.maps.TransitMode => item !== undefined),
						transitRoutePreference:
							[
								google.maps.TransitRoutePreference.FEWER_TRANSFERS,
								google.maps.TransitRoutePreference.LESS_WALKING,
							].find((transitRoutePreference) => transitRoutePreference === data.transitRoutePreference) ||
							google.maps.TransitRoutePreference.FEWER_TRANSFERS,
					}),
					(data) => data,
				),
			);
		}
		return undefined;
	}, [itineraryDocSnap, transitModeConverter, travelModeConverter]);

	useEffect(() => {
		if (plansCRef) {
			const unsubscribe = onSnapshot(query(plansCRef), (querySnapshot) => {
				setDocumentSnapshots((_plansDocSnapMap) => {
					setIsPlansLoading(true);
					querySnapshot.docChanges().forEach((change) => {
						if (change.type === 'added') {
							_plansDocSnapMap[change.doc.id] = change.doc;
						}
						if (change.type === 'modified') {
							_plansDocSnapMap[change.doc.id] = change.doc;
						}
						if (change.type === 'removed') {
							delete _plansDocSnapMap[change.doc.id];
						}
					});
					setIsPlansLoading(false);
					return { ..._plansDocSnapMap };
				});
			});
			return () => unsubscribe();
		}
		return () => undefined;
	}, [plansCRef]);

	// TODO: PG_DATA に追加する
	const value: PlansMapValInterface = useMemo(
		() => ({
			plansDocSnapMap,
			plansCRef,
			isPlansLoading,
			travelModeConverter,
			transitModeConverter,
		}),
		[plansDocSnapMap, plansCRef, isPlansLoading, transitModeConverter, travelModeConverter],
	);

	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
};
