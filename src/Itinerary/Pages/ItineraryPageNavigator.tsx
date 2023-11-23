import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { INV002ItineraryTopTabNavigator } from '../Navigator/INV002ItineraryTopTabNavigator';

import { BottomTabNavigatorScreenProps, ItineraryStackParamList } from '@/Common/Navigation/NavigationInterface';
import { CPA001HelloSpelieve } from '@/Common/Pages/CPA001HelloSpelieve/HelloSpelieve';

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export const ItineraryPageNavigator = ({ navigation, route }: BottomTabNavigatorScreenProps<'Itinerary'>) => (
	<Stack.Navigator initialRouteName="HelloSpelieve">
		<Stack.Screen
			name="ItineraryTopTabNavigator"
			component={INV002ItineraryTopTabNavigator}
			initialParams={{}}
			options={{ title: '' }}
		/>
		<Stack.Screen
			name="HelloSpelieve"
			component={CPA001HelloSpelieve}
			initialParams={{}}
			options={{ headerShown: false }}
		/>
	</Stack.Navigator>
);
