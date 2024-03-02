import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback, useEffect } from 'react';
import { Pressable, Text } from 'react-native';

import { INV002ItineraryTopTabNavigator } from '../Navigator/INV002ItineraryTopTabNavigator';

import { BottomTabNavigatorScreenProps, ItineraryStackParamList } from '@/Common/Navigation/NavigationInterface';
import { CPA001HelloSpelieve } from '@/Common/Pages/CPA001HelloSpelieve/HelloSpelieve';
import { materialColors } from '@/ThemeProvider';

const Stack = createNativeStackNavigator<ItineraryStackParamList>();
const routeName = 'Itinerary' as const;
const initialRouteName = 'HelloSpelieve' as const;

export const ItineraryPageNavigator = ({ navigation, route }: BottomTabNavigatorScreenProps<typeof routeName>) => {
	useEffect(() => {
		// 外部関数に切り出すと想定外のエラーが起きるため個別ページに実装する。
		const unsubscribe = navigation.addListener('tabPress', (e) => {
			if (navigation.getState().routes[navigation.getState().index].name === routeName) {
				// tabPress では、最初の Stack に積まれている画面に遷移するが、 web の場合 URL から奥画面に直接遷移することがあり、
				// 最初の Stack が initialRouteScreen と同一とは限らないため、明示的に initialRouteScreen に遷移する実装を組み込む。
				navigation.navigate('BottomTabNavigator', {
					screen: routeName,
					params: {
						screen: initialRouteName,
						params: {},
					},
				});
				e.preventDefault();
			}
		});
		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const headerTitle = useCallback(
		() => (
			<Pressable
				onPress={() =>
					navigation.navigate(routeName, {
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
			initialRouteName={initialRouteName}
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
