import { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { ICT031PlansMap } from '../..';

export function IMC03101PlanEdit({ planID }: { planID: string }) {
	const useICT031PlansMap = useContext(ICT031PlansMap);
	const plan = useICT031PlansMap.plansDocSnapMap[planID].data();
	return (
		<View>
			<Text>{plan.imageUrl}</Text>
		</View>
	);
}
