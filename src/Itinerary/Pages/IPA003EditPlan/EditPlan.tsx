import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { BottomTabParamList } from '@/App';

export const IPA003EditPlan = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'IPA003EditPlan'>) => {
	const { itineraryID, planID } = route.params;

	return <View>IPA003EditPlan</View>;
};
