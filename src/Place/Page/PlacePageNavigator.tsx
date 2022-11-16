import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import { PPA000DummyPage } from './PPA000DummyPage';
import { PPA000DummyPage2 } from './PPA000DummyPage2';

import { BottomTabParamList } from '@/App';

export type PlaceStackParamList = {
	DummyPage: {}; // 本来は PagePropsInterface を設定する
	DummyPage2: {}; // 本来は PagePropsInterface を設定する
};

const Stack = createNativeStackNavigator<PlaceStackParamList>();

export const PlacePageNavigator = ({ navigation }: NativeStackScreenProps<BottomTabParamList, 'Place'>) => (
		<Stack.Navigator>
			<Stack.Screen name="DummyPage" component={PPA000DummyPage} />
			<Stack.Screen name="DummyPage2" component={PPA000DummyPage2} />
		</Stack.Navigator>
	)
