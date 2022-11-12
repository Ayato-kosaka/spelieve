import { setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, TextInputChangeEventData, View } from 'react-native';
import { Chip, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import i18n from '@/Common/Hooks/i18n-js';

// TODO: DateUtils に移行する
export const add = (base: Date, addition: Date, types: ('Month' | 'Date' | 'Hours' | 'Minutes' | 'Seconds')[]) => {
	const ret = new Date(base.getTime());
	if (types.includes('Month')) {
		ret.setMonth(base.getMonth() + addition.getMonth());
	}
	if (types.includes('Date')) {
		ret.setDate(base.getDate() + addition.getDate());
	}
	if (types.includes('Hours')) {
		ret.setHours(base.getHours() + addition.getHours());
	}
	if (types.includes('Minutes')) {
		ret.setMinutes(base.getMinutes() + addition.getMinutes());
	}
	if (types.includes('Seconds')) {
		ret.setSeconds(base.getSeconds() + addition.getSeconds());
	}
	return ret;
};

export function IMC03101PlanEdit({
	planID,
	beforeAfterRepresentativeType,
}: {
	planID: string;
	beforeAfterRepresentativeType: 'before' | 'representative' | 'after';
}) {
	const useICT031PlansMap = useContext(ICT031PlansMap);
	const planDocSnap = useICT031PlansMap.plansDocSnapMap[planID];
	const plan = planDocSnap.data();

	const [isMounted, setIsMounted] = useState<boolean>(false);

	// representative, before の placeEndTime を設定する
	useEffect(() => {
		if (isMounted && ['representative', 'before'].includes(beforeAfterRepresentativeType)) {
			console.log('debug', 'epresentative, before の placeEndTime を設定する');
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap.ref, {
				...plan,
				placeEndTime: add(plan.placeStartTime, plan.placeSpan, ['Hours', 'Minutes']),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.placeSpan.getTime(), beforeAfterRepresentativeType]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<View style={{ borderWidth: 1 }}>
			<MaterialCommunityIcons name="map-marker" />
			<Text>{planID}</Text>
			<Text>{plan.title}</Text>
			<Text>
				{DateUtils.formatToHHMM(plan.placeStartTime)}~{DateUtils.formatToHHMM(plan.placeEndTime)}
			</Text>

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
