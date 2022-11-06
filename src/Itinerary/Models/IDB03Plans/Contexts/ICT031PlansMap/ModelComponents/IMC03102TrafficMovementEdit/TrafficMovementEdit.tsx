import { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export function IMC03102TrafficMovementEdit({ planID }: { planID: string }) {
	const useICT031PlansMap = useContext(ICT031PlansMap);
	const plan = useICT031PlansMap.plansDocSnapMap[planID].data();
	const { place } = useContext(PCT012MPlaceOne);
	return (
		<View style={{ borderWidth: 1 }}>
			<MaterialCommunityIcons name="train" />
			<Text>{plan.transportationDepartureTime ? DateUtils.formatToHHMM(plan.transportationDepartureTime) : ''}</Text>
			<Text>~</Text>
			<Text>{plan.transportationArrivalTime ? DateUtils.formatToHHMM(plan.transportationArrivalTime) : ''}</Text>
		</View>
	);
}
