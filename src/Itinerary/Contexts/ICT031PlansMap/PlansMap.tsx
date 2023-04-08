import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, useContext, ReactNode } from 'react';

import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
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
	}, [plansCRef]);

	const value: PlansMapValInterface = useMemo(
		() => ({
			plansDocSnapMap,
			plansCRef,
			isPlansLoading,
		}),
		[plansDocSnapMap, plansCRef, isPlansLoading],
	);

	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
};
