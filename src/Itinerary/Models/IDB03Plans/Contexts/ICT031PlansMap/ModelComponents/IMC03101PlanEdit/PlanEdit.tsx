import { useContext } from 'react';
import { FlatList, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

export function IMC03101PlanEdit({ planID }: { planID: string }) {
	const useICT031PlansMap = useContext(ICT031PlansMap);
	const plan = useICT031PlansMap.plansDocSnapMap[planID].data();
	return (
		<View style={{ borderWidth: 1 }}>
			<MaterialCommunityIcons name="map-marker" />
			<Text>{plan.title}</Text>
			<Text>
				{DateUtils.formatToHHMM(plan.placeStartTime)}~{DateUtils.formatToHHMM(plan.placeEndTime)}
			</Text>
			<FlatList data={plan.tags} renderItem={(renderItemInfo) => <Chip>{renderItemInfo.item}</Chip>} />
		</View>
	);
}
