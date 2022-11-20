import { QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';

export const IMC03101PlanEdit = ({
	planID,
	beforeAfterRepresentativeType,
	dependentPlanID,
	planGroupsDoc,
	isPlanGroupMounted,
}: {
	// TODO PG_DATA に移行する
	planID: string;
	beforeAfterRepresentativeType: 'before' | 'representative' | 'after';
	dependentPlanID: string;
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	isPlanGroupMounted: boolean;
}) => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = plansDocSnapMap[planID];
	const plan = planDocSnap.data();

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
					placeStartTime:
						plansDocSnapMap[dependentPlanID].data().transportationArrivalTime ||
						plansDocSnapMap[dependentPlanID].data().placeEndTime,
				},
				{ merge: true },
			);
			// console.log("finish setDoc", planDocSnap)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		plansDocSnapMap[dependentPlanID].data().transportationArrivalTime?.getTime() ||
			plansDocSnapMap[dependentPlanID].data().placeEndTime.getTime(),
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
					placeEndTime: plan.transportationDepartureTime || plansDocSnapMap[dependentPlanID].data().placeStartTime,
				},
				{ merge: true },
			);
			// console.log("finish setDoc", planDocSnap)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// eslint-disable-next-line react-hooks/exhaustive-deps
		plansDocSnapMap[planID].data().transportationDepartureTime?.getTime() ||
			plansDocSnapMap[dependentPlanID].data().placeStartTime.getTime(),
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

	return (
		<View style={{ borderWidth: 1 }}>
			<MaterialCommunityIcons name="map-marker" />
			<Text>
				props=
				{JSON.stringify(
					{
						planID,
						beforeAfterRepresentativeType,
					},
					null,
					'\t',
				)}
			</Text>
			<Text>{plan.title}</Text>
			<Text>
				{DateUtils.formatToHHMM(plan.placeStartTime)}~{DateUtils.formatToHHMM(plan.placeEndTime)}
			</Text>

			{/* TODO: あとで消す */}
			{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/336　span 用コンポーネントを作成する */}
			<View>
				<Text>{i18n.t('placeSpan')}</Text>
				<CCO003DateTimePicker
					value={plan.placeSpan}
					onChange={(event, date) => {
						if (event.type === 'set') {
							setDoc(planDocSnap.ref, {
								...plan,
								placeSpan: date!,
							});
						}
					}}
					mode="time"
				/>
			</View>
			<FlatList data={plan.tags} renderItem={(renderItemInfo) => <Chip>{renderItemInfo.item}</Chip>} />
		</View>
	);
};
