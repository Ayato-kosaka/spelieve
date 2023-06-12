import { TransitMode, TransitRoutingPreference } from '@googlemaps/google-maps-services-js';
import { collection, query, QuerySnapshot, onSnapshot, addDoc, orderBy, setDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext, useMemo, ReactNode, useCallback } from 'react';

import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { PlanGroupsListInterface, PlanGroupsListValInterface } from './PlanGroupsListInterface';

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
				throw new Error('not initialized');
			}
			const newPlan: Plans = {
				title: '',
				placeSpan: DateUtils.initialDate(),
				placeStartTime: itinerary.startDate,
				placeEndTime: itinerary.startDate,
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

	const swapPlanOrder = useCallback(
		async (
			index1: {
				planGroup: number;
				plan: number;
			},
			index2: {
				planGroup: number;
				plan: number;
			},
		) => {
			const planGroupsQDSnap = planGroupsQSnap?.docs;
			if (!plansCRef || !planGroupsCRef || !itinerary || !planGroupsQDSnap) {
				throw new Error('not initialized');
			}
			const planGroup1 = planGroupsQDSnap[index1.planGroup].data();
			const planGroup2 = planGroupsQDSnap[index2.planGroup].data();
			if (planGroup1?.plans?.at(index1.plan) === undefined || planGroup2?.plans?.at(index2.plan) === undefined) {
				throw new Error('index out of range');
			}
			// planIndex が負の場合は末尾からのインデックスとして扱う
			if (index1.plan < 0) index1.plan += planGroup1.plans.length;
			if (index2.plan < 0) index2.plan += planGroup2.plans.length;
			[planGroup1.plans[index1.plan], planGroup2.plans[index2.plan]] = [
				planGroup2.plans[index2.plan],
				planGroup1.plans[index1.plan],
			];
			await setDoc(planGroupsQDSnap[index1.planGroup].ref, { ...planGroup1 });
			await setDoc(planGroupsQDSnap[index2.planGroup].ref, { ...planGroup2 });
		},
		[itinerary, planGroupsCRef, planGroupsQSnap?.docs, plansCRef],
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
			swapPlanOrder,
		}),
		[planGroupsQSnap, planGroupsCRef, createPlanGroup, swapPlanOrder],
	);
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
};
