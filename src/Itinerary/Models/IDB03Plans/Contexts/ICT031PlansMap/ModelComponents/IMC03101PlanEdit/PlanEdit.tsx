import { setDoc } from 'firebase/firestore';
import React, { useContext, useMemo } from 'react';
import { Button, FlatList, Pressable, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanEditPropsInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { IMC03101PlanEditController } from './PlanEditController';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import i18n from '@/Common/Hooks/i18n-js';

export const IMC03101PlanEdit = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
}: PlanEditPropsInterface) => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);

	const { deletePlan, onPlanPress } = IMC03101PlanEditController({
		planID,
		beforeAfterRepresentativeType,
		dependentPlanID,
		planGroupsDoc,
		isPlanGroupMounted,
	});

	return (
		<Pressable style={{ borderWidth: 1 }} onPress={onPlanPress}>
			<MaterialCommunityIcons name="map-marker" />
			{/* TODO: あとで消す */}
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
			{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/336 span 用コンポーネントを作成する */}
			<View>
				<Text>{i18n.t('placeSpan')}</Text>
				<CCO003DateTimePicker
					value={plan.placeSpan}
					onChange={(event, date) => {
						if (event.type === 'set') {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
			<Button
				title={i18n.t('予定を削除')}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					deletePlan();
				}}
			/>
		</Pressable>
	);
};
