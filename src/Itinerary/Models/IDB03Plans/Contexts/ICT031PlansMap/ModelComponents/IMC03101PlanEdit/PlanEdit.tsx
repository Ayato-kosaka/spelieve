import { QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { FlatList, TextInputChangeEventData, View } from 'react-native';
import { Chip, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import i18n from '@/Common/Hooks/i18n-js';

export function IMC03101PlanEdit({
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
}) {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = plansDocSnapMap[planID];
	const plan = planDocSnap.data();

	// before の placeStartTime を設定する
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'before') {
			console.log('debug', planID, 'before の placeStartTime を設定する');
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeStartTime: DateUtils.subtraction(plan.placeEndTime, plan.placeSpan, ['Hours', 'Minutes']),
				},
				{ merge: true },
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.placeSpan.getTime(), plan.placeEndTime.getTime(), beforeAfterRepresentativeType]);

	// representative の placeStartTime を設定する
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'representative') {
			console.log('debug', planID, 'representative の placeStartTime を設定する');
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

	// after の placeStartTime を設定する
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'after') {
			console.log('debug', planID, 'after の placeStartTime を設定する');
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

	// before の placeEndTime を設定する
	useEffect(() => {
		if (isPlanGroupMounted && beforeAfterRepresentativeType === 'before') {
			console.log('debug', planID, 'before の placeEndTime を設定する');
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

	// representative, after の placeEndTime を設定する
	useEffect(() => {
		if (isPlanGroupMounted && ['representative', 'after'].includes(beforeAfterRepresentativeType)) {
			console.log('debug', planID, 'representative, after の placeEndTime を設定する');
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{
					placeEndTime: DateUtils.addition(plan.placeStartTime, plan.placeSpan, ['Hours', 'Minutes']),
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
			<TextInput
				label={i18n.t('placeSpan')}
				value={(plan.placeSpan.getTime() + 32400000).toString()}
				onChange={({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => {
					setDoc(planDocSnap.ref, {
						...plan,
						placeSpan: new Date((parseInt(nativeEvent.text, 10) || 0) - 32400000),
					});
				}}
			/>
			<FlatList data={plan.tags} renderItem={(renderItemInfo) => <Chip>{renderItemInfo.item}</Chip>} />
		</View>
	);
}
