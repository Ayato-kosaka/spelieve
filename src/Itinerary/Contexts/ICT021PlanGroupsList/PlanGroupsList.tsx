import { query, QuerySnapshot, onSnapshot, addDoc, orderBy, setDoc, deleteDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useContext, useMemo, ReactNode, useCallback } from 'react';

import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';

import { ICT021PlanGroupsListController } from './PlanGroupsListController';
import { PlanGroupsListInterface, PlanGroupsListValInterface } from './PlanGroupsListInterface';

import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';

export const ICT021PlanGroupsList = createContext({} as PlanGroupsListValInterface);

export const ICT021PlanGroupsListProvider = ({ children }: { children: ReactNode }) => {
	const [planGroupsQSnap, setPlanGroupsQSnap] = useState<QuerySnapshot<PlanGroupsListInterface> | undefined>(undefined);

	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { plansCRef, plansDocSnapMap, createPlan } = useContext(ICT031PlansMap);

	const itinerary = useMemo(() => itineraryDocSnap?.data(), [itineraryDocSnap]);

	const { planGroupsCRef } = ICT021PlanGroupsListController(itineraryDocSnap);

	const createPlanGroup = useCallback(
		async (plan?: Partial<Plans>) => {
			if (!planGroupsCRef || !itinerary) {
				throw new Error('not initialized');
			}
			const newPlan = {
				placeStartTime: itinerary.startDate,
				placeEndTime: itinerary.startDate,
				...plan,
			};
			const planDocRef = await createPlan(newPlan);
			await addDoc(planGroupsCRef, {
				plans: [planDocRef.id],
				representativePlanID: planDocRef.id,
				dayNumber: 0,
				representativeStartDateTime: newPlan.placeStartTime,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		},
		[createPlan, itinerary, planGroupsCRef],
	);

	const movePlan = useCallback(
		async (
			from: {
				planGroupIndex: number;
				planIndex: number;
			},
			to: {
				planGroupIndex: number;
				planIndex: number;
			},
		) => {
			const planGroupsQDSnap = planGroupsQSnap?.docs;
			if (!plansCRef || !planGroupsCRef || !itinerary || !planGroupsQDSnap) {
				throw new Error('not initialized');
			}
			const fromPlanGroup = planGroupsQDSnap[from.planGroupIndex].data();
			const toPlanGroup = planGroupsQDSnap[to.planGroupIndex].data();
			if (from.planGroupIndex === to.planGroupIndex) {
				// 同じプラングループ内での移動
				if (from.planIndex === to.planIndex) {
					return;
				}
				if (fromPlanGroup?.plans?.[from.planIndex] === undefined || toPlanGroup?.plans?.[to.planIndex] === undefined) {
					throw new Error('index out of range');
				}
				[fromPlanGroup.plans[from.planIndex], fromPlanGroup.plans[to.planIndex]] = [
					fromPlanGroup.plans[to.planIndex],
					fromPlanGroup.plans[from.planIndex],
				];
				await setDoc(planGroupsQDSnap[from.planGroupIndex].ref, { ...fromPlanGroup });
			} else {
				// 異なるプラングループ間での移動
				const targetPlanID = fromPlanGroup.plans.splice(from.planIndex, 1)[0];
				if (!targetPlanID) {
					throw new Error('target plan not found');
				}
				toPlanGroup.plans.splice(to.planIndex, 0, targetPlanID);
				if (fromPlanGroup.plans.length === 0) {
					await deleteDoc(planGroupsQDSnap[from.planGroupIndex].ref);
				} else {
					// targetPlanID が代表プランである場合、先頭プランを代表プランにする
					if (fromPlanGroup.representativePlanID === targetPlanID) {
						[fromPlanGroup.representativePlanID] = fromPlanGroup.plans;
						fromPlanGroup.representativeStartDateTime =
							plansDocSnapMap[fromPlanGroup.representativePlanID]?.data().placeStartTime;
					}
					await setDoc(planGroupsQDSnap[from.planGroupIndex].ref, { ...fromPlanGroup });
				}
				await setDoc(planGroupsQDSnap[to.planGroupIndex].ref, { ...toPlanGroup });
			}
		},
		[itinerary, planGroupsCRef, planGroupsQSnap?.docs, plansCRef, plansDocSnapMap],
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
			movePlan,
		}),
		[planGroupsQSnap, planGroupsCRef, createPlanGroup, movePlan],
	);
	return <ICT021PlanGroupsList.Provider value={value}>{children}</ICT021PlanGroupsList.Provider>;
};
