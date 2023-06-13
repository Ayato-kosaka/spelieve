import { setDoc, doc, deleteDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo } from 'react';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { PlanEditPropsInterface } from './PlanEditPropsInterface';

import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';

export const IMC03101PlanEditController = ({
	planID,
	beforeAfterRepresentativeType,
	dependentPlanID,
	planGroupsDoc,
	isPlanGroupMounted,
}: Omit<PlanEditPropsInterface, 'onPlanPress'>) => {
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const { plansCRef, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { swapPlanOrder } = useContext(ICT021PlanGroupsList);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const planGroup = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroup.plans.indexOf(planID), [planGroup, planID]);
	const dependentPlan = useMemo(() => plansDocSnapMap[dependentPlanID].data(), [dependentPlanID, plansDocSnapMap]);
	const planGroupIndex = planGroupsQSnap?.docs.indexOf(planGroupsDoc)!;

	/** **********************************************************************************************
	 * before の PlaceStartTime を設定する
	 * 自分の予定の Span, PlaeEndTime を監視し、
	 * PlaceStartTime = current.PlaeEndTime - current.Span で計算する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'before') {
			CHK001Utils.Logger('IMC03101PlanEdit', 'before の placeStartTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeStartTime: DateUtils.subtraction(plan.placeEndTime, plan.placeSpan, ['Hours', 'Minutes', 'Seconds']),
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.placeSpan.getTime(), plan.placeEndTime.getTime(), beforeAfterRepresentativeType]);

	/** **********************************************************************************************
	 * representative の PlaceStartTime を設定する
	 * PlanGroup の RepresentativeStartDateTime を監視し、
	 * PlaceStartTime = PlanGroup.RepresentativeStartDateTime を設定する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'representative') {
			CHK001Utils.Logger('IMC03101PlanEdit', 'representative の placeStartTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeStartTime: planGroupsDoc.data().representativeStartDateTime,
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [planGroupsDoc.data().representativeStartDateTime.getTime(), beforeAfterRepresentativeType]);

	/** **********************************************************************************************
	 * after の PlaceStartTime を設定する
	 * 前の予定の TransportationArrivalTime, PlaceEndTime を監視し、
	 * PlaceStartTime = before.TransportationArrivalTime || before.PlaceEndTime を設定する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'after') {
			CHK001Utils.Logger('IMC03101PlanEdit', 'after の placeStartTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeStartTime: dependentPlan.transportationArrivalTime || dependentPlan.placeEndTime,
				},
				{ merge: true },
			);
			// console.log("finish setDoc", planDocSnap)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependentPlan.transportationArrivalTime?.getTime() || dependentPlan.placeEndTime.getTime(),
		beforeAfterRepresentativeType,
	]);

	/** **********************************************************************************************
	 * before の PlaceEndTime を設定する
	 * 自分の予定の TransportationDepartureTime, 次の予定の PlaceStartTime を監視し、
	 * PlaceEndTime = current.TransportationDepartureTime || next.PlaceStartTime を設定する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'before') {
			CHK001Utils.Logger('IMC03101PlanEdit', 'before の placeEndTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeEndTime: plan.transportationDepartureTime || dependentPlan.placeStartTime,
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		plansDocSnapMap[planID].data().transportationDepartureTime?.getTime() || dependentPlan.placeStartTime.getTime(),
		beforeAfterRepresentativeType,
	]);

	/** **********************************************************************************************
	 * representative, after の PlaceEndTime, transportationDepartureTime を設定する
	 * 自分の予定の PlaceStartTime, Span を監視し、
	 * PlaceEndTime, transportationDepartureTime = current.PlaceStartTime + current.Span で計算する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && ['representative', 'after'].includes(beforeAfterRepresentativeType)) {
			CHK001Utils.Logger(
				'IMC03101PlanEdit',
				'representative, after の PlaceEndTime, transportationDepartureTime を設定する',
				planID,
			);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeEndTime: DateUtils.addition(plan.placeStartTime, plan.placeSpan, ['Hours', 'Minutes', 'Seconds']),
					transportationDepartureTime: DateUtils.addition(plan.placeStartTime, plan.placeSpan, [
						'Hours',
						'Minutes',
						'Seconds',
					]),
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.placeStartTime.getTime(), plan.placeSpan.getTime(), beforeAfterRepresentativeType]);

	/** **********************************************************************************************
	 * before の transportationDepartureTime を設定する
	 * 自分の予定の transportationArrivalTime, transportationSpan を監視し、
	 * transportationDepartureTime = current.transportationArrivalTime - current.transportationSpan を設定する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'before' && plan.transportationArrivalTime) {
			CHK001Utils.Logger('IMC03101PlanEdit', 'before の transportationDepartureTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					transportationDepartureTime: DateUtils.subtraction(plan.transportationArrivalTime, plan.transportationSpan, [
						'Hours',
						'Minutes',
						'Seconds',
					]),
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.transportationArrivalTime?.getTime(), plan.transportationSpan.getTime(), beforeAfterRepresentativeType]);

	/** **********************************************************************************************
	 * before の transportationArrivalTime を設定する
	 * 次の予定の PlaceStartTime を監視し、
	 * transportationArrivalTime = next.PlaceStartTime を設定する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'before') {
			CHK001Utils.Logger('IMC03101PlanEdit', 'before の transportationArrivalTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					transportationArrivalTime: dependentPlan.placeStartTime,
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependentPlan.placeStartTime.getTime(),
		beforeAfterRepresentativeType,
	]);

	/** **********************************************************************************************
	 * representative, after の transportationArrivalTime を設定する
	 * 自分の予定の transportationSpan を監視し、
	 * transportationArrivalTime = current.transportationDepartureTime + current.transportationSpan で計算する
	 *********************************************************************************************** */
	useEffect(() => {
		if (
			isPlanGroupMounted &&
			['representative', 'after'].includes(beforeAfterRepresentativeType) &&
			plan.transportationDepartureTime
		) {
			CHK001Utils.Logger('IMC03101PlanEdit', 'representative, after の transportationArrivalTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					transportationArrivalTime: DateUtils.addition(plan.transportationDepartureTime, plan.transportationSpan, [
						'Hours',
						'Minutes',
						'Seconds',
					]),
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.transportationSpan.getTime(), beforeAfterRepresentativeType]);

	const deletePlan = useCallback(async () => {
		const newPlanGroup = { ...planGroup };
		newPlanGroup.plans.splice(plansIndex, 1);
		if (newPlanGroup.plans.length !== 0) {
			if (newPlanGroup.representativePlanID === planID) {
				[newPlanGroup.representativePlanID] = newPlanGroup.plans;
				newPlanGroup.representativeStartDateTime =
					plansDocSnapMap[newPlanGroup.representativePlanID].data().placeStartTime;
			}
			await setDoc(planGroupsDoc.ref, { ...newPlanGroup });
		} else {
			await deleteDoc(planGroupsDoc.ref);
		}
		await deleteDoc(doc(plansCRef!, planID));
	}, [planGroup, plansIndex, plansCRef, planID, planGroupsDoc.ref, plansDocSnapMap]);

	const movePlanUpAndDown = useCallback(
		async (direction: 'up' | 'down', selectedPlanIndex: number) => {
			const selectedIndex = {
				planGroup: planGroupIndex,
				plan: selectedPlanIndex,
			};
			if (direction === 'up') {
				if (selectedPlanIndex > 0) {
					// 同じ PlanGroup 内で一つ上に移動
					await swapPlanOrder(selectedIndex, {
						planGroup: planGroupIndex,
						plan: selectedPlanIndex - 1,
					});
				} else {
					// 前の PlanGroup の一番下に移動
					await swapPlanOrder(selectedIndex, {
						planGroup: planGroupIndex - 1,
						plan: -1,
					});
				}
			} else if (direction === 'down') {
				if (selectedPlanIndex < planGroup.plans.length - 1) {
					// 同じ PlanGroup 内で一つ下に移動
					await swapPlanOrder(selectedIndex, {
						planGroup: planGroupIndex,
						plan: selectedPlanIndex + 1,
					});
				} else {
					// 次の PlanGroup の一番上に移動
					await swapPlanOrder(selectedIndex, {
						planGroup: planGroupIndex + 1,
						plan: 0,
					});
				}
			}
		},
		[planGroup.plans.length, planGroupIndex, swapPlanOrder],
	);

	const onSelectPlanMenu = useCallback(
		async (params: { command: 'up' | 'down' | 'delete'; planIndex: number }) => {
			if (params.command === 'delete') {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				await deletePlan();
			} else {
				await movePlanUpAndDown(params.command, params.planIndex);
			}
		},
		[deletePlan, movePlanUpAndDown],
	);

	return { onSelectPlanMenu };
};
