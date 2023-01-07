import { TransitMode, TransitRoutingPreference } from '@googlemaps/google-maps-services-js';
import { collection, query, QuerySnapshot, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext, useMemo, ReactNode, useCallback } from 'react';

import { PlanGroupsListInterface, PlanGroupsListValInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';

export const ICT021PlanGroupsList = createContext({} as PlanGroupsListValInterface);

export const ICT021PlanGroupsListProvider = ({ children }: { children: ReactNode }) => {
	const [planGroupsQSnap, setPlanGroupsQSnap] = useState<QuerySnapshot<PlanGroupsListInterface> | undefined>(undefined);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { plansCRef } = useContext(ICT031PlansMap);

	const itinerary = useMemo(() => itineraryDocSnap?.data(), [itineraryDocSnap]);

	const planGroupsCRef = useMemo(() => {
		if (itineraryDocSnap) {
			return collection(itineraryDocSnap.ref, PlanGroups.modelName).withConverter(
				FirestoreConverter<PlanGroups, PlanGroupsListInterface>(
					PlanGroups,
					(data) => ({
						...data,
						dayNumber: Math.floor(
							(data.representativeStartDateTime.getTime() - (itineraryDocSnap.data()?.startDate?.getTime() || 0)) /
								(1000 * 60 * 60 * 24) +
								1,
						),
					}),
					(data) => ({
						...data,
						dayNumber: undefined,
					}),
				),
			);
		}
		return undefined;
	}, [itineraryDocSnap]);

	const createPlanGroup = useCallback(
		async (plan?: Partial<Plans>) => {
			if (!plansCRef || !planGroupsCRef || !itinerary) {
				return;
			}
			const newPlan: Plans = {
				title: '',
				placeSpan: DateUtils.initialDate(),
				placeStartTime: itinerary.startDate,
				placeEndTime: itinerary.startDate,
				tags: [],
				transportationSpan: DateUtils.initialDate(),
				avoid: [],
				transitModes: [TransitMode.bus, TransitMode.rail, TransitMode.subway, TransitMode.train, TransitMode.tram],
				transitRoutingPreference: TransitRoutingPreference.fewer_transfers,
				createdAt: new Date(),
				updatedAt: new Date(),
				...plan,
			};
			const planDocRef = await addDoc(plansCRef, newPlan);
			await addDoc(planGroupsCRef, {
				plans: [planDocRef.id],
				representativePlanID: planDocRef.id,
				dayNumber: 0,
				representativeStartDateTime: newPlan.placeStartTime,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		},
		[itinerary, planGroupsCRef, plansCRef],
	);

	useEffect(() => {
		if (!planGroupsCRef || !plansCRef || !itinerary) {
			setPlanGroupsQSnap(undefined);
			return () => undefined;
		}
		const unsubscribe = onSnapshot(
			query(planGroupsCRef, orderBy(PlanGroups.Cols.representativeStartDateTime)),
			(querySnap) => {
				setPlanGroupsQSnap(querySnap);
			},
		);
		return () => unsubscribe();
	}, [planGroupsCRef, plansCRef, createPlanGroup, itinerary]);

	const value: PlanGroupsListValInterface = useMemo(
		() => ({
			planGroupsQSnap,
			planGroupsCRef,
			createPlanGroup,
		}),
		[planGroupsQSnap, planGroupsCRef, createPlanGroup],
	);
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
};
