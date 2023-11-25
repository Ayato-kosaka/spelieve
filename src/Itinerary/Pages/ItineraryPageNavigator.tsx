import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';

import { INV002ItineraryTopTabNavigator } from '../Navigator/INV002ItineraryTopTabNavigator';

import { BottomTabNavigatorScreenProps, ItineraryStackParamList } from '@/Common/Navigation/NavigationInterface';
import { CPA001HelloSpelieve } from '@/Common/Pages/CPA001HelloSpelieve/HelloSpelieve';
import { materialColors } from '@/ThemeProvider';

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export const ItineraryPageNavigator = ({ navigation, route }: BottomTabNavigatorScreenProps<'Itinerary'>) => {
	const headerTitle = useCallback(
		() => (
			<Pressable
				onPress={() =>
					navigation.navigate('Itinerary', {
						screen: 'HelloSpelieve',
						params: {},
					})
				}>
				<Text
					style={{
						color: 'white',
						fontSize: 30,
						fontWeight: 'bold',
						fontFamily: 'Verdana',
					}}>
					Spelieve
				</Text>
			</Pressable>
		),
		[navigation],
	);
	return (
		<Stack.Navigator
			initialRouteName="HelloSpelieve"
			screenOptions={{
				headerStyle: {
					backgroundColor: materialColors.orange['500'],
				},
				headerTitle,
				headerTitleAlign: 'center',
				headerLeft: () => null,
			}}>
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
};
