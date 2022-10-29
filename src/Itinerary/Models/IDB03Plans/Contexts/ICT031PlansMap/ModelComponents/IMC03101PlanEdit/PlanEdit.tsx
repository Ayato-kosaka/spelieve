import { useContext } from 'react';
import { FlatList, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export function IMC03101PlanEdit({ planID }: { planID: string }) {
	const useICT031PlansMap = useContext(ICT031PlansMap);
	const plan = useICT031PlansMap.plansDocSnapMap[planID].data();
	const { place } = useContext(PCT012MPlaceOne);
	return (
		<View style={{borderWidth: 1}}>
			<Icon name='map-marker'></Icon>
			<Text>{place.name}</Text>
			<Text>{DateUtils.formatToHHMM(plan.placeStartTime)}~{DateUtils.formatToHHMM(plan.placeEndTime)}</Text>
			<FlatList data={plan.tags} renderItem={(renderItemInfo) => <Chip>{renderItemInfo.item}</Chip>} />
		</View>
	);
}
