import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { PCT012MPlaceOneProvider } from '../../Contexts/PCT012MPlaceOne/MPlaceOne';
import { PPA001Places } from '../PPA001Places';
import { PPA002Place } from '../PPA002Place/Place';

import { BottomTabNavigatorScreenProps, PlaceStackParamList } from '@/Common/Navigation/NavigationInterface';
import { PCT011MPlacesListProvider } from '@/Place/Contexts/PCT011MPlacesList';

const Stack = createNativeStackNavigator<PlaceStackParamList>();
const routeName = 'Place' as const;
const initialRouteName = 'PPA001Places' as const;

export const PlacePageNavigator = ({ navigation, route }: BottomTabNavigatorScreenProps<typeof routeName>) => {
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
	return (
		<PCT012MPlaceOneProvider>
			<PCT011MPlacesListProvider>
				<Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
					<Stack.Screen name="PPA001Places" component={PPA001Places} initialParams={{}} />
					<Stack.Screen name="PPA002Place" component={PPA002Place} initialParams={{}} />
				</Stack.Navigator>
			</PCT011MPlacesListProvider>
		</PCT012MPlaceOneProvider>
	);
};
