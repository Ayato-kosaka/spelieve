import { TransitMode, TravelMode, TransitRoutingPreference } from '@googlemaps/google-maps-services-js';
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

	// TODO: travel mode を hooks に切り出す
	const travelModeConverter: {
		[key in TravelMode]: {
			iconName: string;
			title: string;
		};
	} = useMemo(
		() => ({
			[TravelMode.bicycling]: {
				iconName: 'bicycle',
				title: i18n.t('Bicycling'),
			},
			[TravelMode.driving]: {
				iconName: 'car',
				title: i18n.t('Driving'),
			},
			[TravelMode.transit]: {
				iconName: 'subway-variant',
				title: i18n.t('Transit'),
			},
			[TravelMode.walking]: {
				iconName: 'walk',
				title: i18n.t('Walking'),
			},
		}),
		[],
	);

	const transitModeConverter: {
		[key in TransitMode]: {
			iconName: string;
			title: string;
		};
	} = useMemo(
		() => ({
			[TransitMode.bus]: {
				iconName: 'bus',
				title: i18n.t('Bus'),
			},
			[TransitMode.rail]: {
				iconName: 'train-variant',
				title: i18n.t('Rail'),
			},
			[TransitMode.subway]: {
				iconName: 'subway',
				title: i18n.t('Subway'),
			},
			[TransitMode.train]: {
				iconName: 'train',
				title: i18n.t('Train'),
			},
			[TransitMode.tram]: {
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
						transportationMode: (Object.keys(travelModeConverter) as TravelMode[]).find(
							(travelMode) => travelMode === data.transportationMode,
						),
						transitModes: data.transitModes
							.map((e) => (Object.keys(transitModeConverter) as TransitMode[]).find((item) => e === item))
							.filter((item): item is TransitMode => item !== undefined),
						transitRoutingPreference:
							[TransitRoutingPreference.fewer_transfers, TransitRoutingPreference.less_walking].find(
								(transitRoutingPreference) => transitRoutingPreference === data.transitRoutingPreference,
							) || TransitRoutingPreference.fewer_transfers,
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
