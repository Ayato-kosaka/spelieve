import { TransitMode, TransitRoutingPreference } from '@googlemaps/google-maps-services-js';
import { query, onSnapshot, addDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo, useContext, ReactNode, useCallback } from 'react';

import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMapController } from './PlansMapController';
import { PlansMapValInterface } from './PlansMapInterface';

import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';

export const ICT031PlansMap = createContext({} as PlansMapValInterface);

export const ICT031PlansMapProvider = ({ children }: { children: ReactNode }) => {
	const [plansDocSnapMap, setDocumentSnapshots] = useState<PlansMapValInterface['plansDocSnapMap']>({});
	const [isPlansLoading, setIsPlansLoading] = useState<boolean>(true);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);

	const { getPlansCRef } = ICT031PlansMapController();
	const plansCRef = useMemo(
		() => (itineraryDocSnap ? getPlansCRef(itineraryDocSnap.ref) : undefined),
		[getPlansCRef, itineraryDocSnap],
	);

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
