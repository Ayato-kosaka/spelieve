import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setDoc, doc, deleteDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useMemo } from 'react';

import { PlanEditControllerInterface, PlanEditPropsInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { BottomTabParamList } from '@/App';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';

export const IMC03101PlanEditController = ({
	planID,
	beforeAfterRepresentativeType,
	dependentPlanID,
	planGroupsDoc,
	isPlanGroupMounted,
}: PlanEditPropsInterface): PlanEditControllerInterface => {
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const { plansCRef, plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const planGroup = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroup.plans.indexOf(planID), [planGroup, planID]);
	const dependentPlan = useMemo(() => plansDocSnapMap[dependentPlanID].data(), [dependentPlanID, plansDocSnapMap]);

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
			// console.log("finish setDoc", planDocSnap)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		plansDocSnapMap[planID].data().transportationDepartureTime?.getTime() || dependentPlan.placeStartTime.getTime(),
		beforeAfterRepresentativeType,
	]);

	/** **********************************************************************************************
	 * representative, after の PlaceEndTime を設定する
	 * 自分の予定の PlaceStartTime, Span を監視し、
	 * PlaceEndTime = current.PlaceStartTime + current.Span で計算する
	 *********************************************************************************************** */
	useEffect(() => {
		if (isPlanGroupMounted && ['representative', 'after'].includes(beforeAfterRepresentativeType)) {
			CHK001Utils.Logger('IMC03101PlanEdit', 'representative, after の placeEndTime を設定する', planID);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeEndTime: DateUtils.addition(plan.placeStartTime, plan.placeSpan, ['Hours', 'Minutes', 'Seconds']),
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.placeStartTime.getTime(), plan.placeSpan.getTime(), beforeAfterRepresentativeType]);

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

	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);

	const onPlanPress = useCallback(() => {
		navigation.navigate('Itinerary', {
			screen: 'IPA003EditPlan',
			params: {
				itineraryID: itineraryDocSnap?.id,
				PlanGroupsIndex: planGroupsQSnap?.docs.findIndex((element) => element.id === planGroupsDoc.id),
				planID: planDocSnap.id,
			},
		});
	}, [navigation, itineraryDocSnap?.id, planDocSnap.id, planGroupsDoc.id, planGroupsQSnap]);

	return { deletePlan, onPlanPress };
};
