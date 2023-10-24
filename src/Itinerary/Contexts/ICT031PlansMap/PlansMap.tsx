import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, useContext, ReactNode, useCallback } from 'react';

import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { PlansMapInterface, PlansMapValInterface } from './PlansMapInterface';

import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import {
	transitModeConverter,
	travelModeConverter,
	travelRestrictionConverter,
} from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const ICT031PlansMap = createContext({} as PlansMapValInterface);

export const ICT031PlansMapProvider = ({ children }: { children: ReactNode }) => {
	const [plansDocSnapMap, setDocumentSnapshots] = useState<PlansMapValInterface['plansDocSnapMap']>({});
	const [isPlansLoading, setIsPlansLoading] = useState<boolean>(true);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);

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
						avoid: data.avoid
							.map((e) => (Object.keys(travelRestrictionConverter) as TravelRestriction[]).find((item) => e === item))
							.filter((item): item is TravelRestriction => item !== undefined),
					}),
					(data) => data,
				),
			);
		}
		return undefined;
	}, [itineraryDocSnap]);

	useEffect(() => {
		setIsPlansLoading(true);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!!plansCRef]);

	const createPlan: PlansMapValInterface['createPlan'] = useCallback(
		async (plan) => {
			if (!plansCRef) {
				throw new Error('not initialized');
			}
			const newPlan: Plans = {
				title: '',
				placeSpan: DateUtils.initialDate(),
				transportationSpan: DateUtils.initialDate(),
				avoid: [],
				transitModes: [TransitMode.bus, TransitMode.rail, TransitMode.subway, TransitMode.train, TransitMode.tram],
				transitRoutingPreference: TransitRoutingPreference.fewer_transfers,
				textMap: {},
				storeUrlMap: {},
				createdAt: new Date(),
				updatedAt: new Date(),
				...plan,
			};
			return addDoc(plansCRef, newPlan);
		},
		[plansCRef],
	);

	const value: PlansMapValInterface = useMemo(
		() => ({
			plansDocSnapMap,
			plansCRef,
			isPlansLoading,
			createPlan,
		}),
		[plansDocSnapMap, plansCRef, isPlansLoading, createPlan],
	);

	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
};
