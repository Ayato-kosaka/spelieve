import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import { PPA001Places } from './PPA001Places';
import { PPA002Place } from './PPA002Place/Place';
import { PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';
import { PlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';

export type PlaceStackParamList = {
	PPA001Places: PlacesPropsInterface; // 本来は PagePropsInterface を設定する
	PPA002Place: PlacePropsInterface; // 本来は PagePropsInterface を設定する
};

const Stack = createNativeStackNavigator<PlaceStackParamList>();

export function PlacePageNavigator({ navigation }: NativeStackScreenProps<BottomTabParamList, 'Place'>) {
	return (
		<Stack.Navigator initialRouteName="PPA001Places">
			<Stack.Screen name="PPA001Places" component={PPA001Places} />
			<Stack.Screen name="PPA002Place" component={PPA002Place} />
		</Stack.Navigator>
	);
}
