import 'expo-dev-client';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Provider as PaperProvider } from 'react-native-paper';

import { AppProvider } from './AppProvider';
import i18n from './Common/Hooks/i18n-js';
import { ItineraryPageNavigator, ItineraryStackParamList } from './Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator, PlaceStackParamList } from './Place/Pages/PlacePageNavigator/PlacePageNavigator';
import { navigationTheme, paperTheme } from './ThemeProvider';

export type BottomTabParamList = {
	Itinerary: NavigatorScreenParams<ItineraryStackParamList>;
	Place: NavigatorScreenParams<PlaceStackParamList>;
} & ItineraryStackParamList &
	PlaceStackParamList;

export const App = () => {
	const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

	return (
		<NavigationContainer
			linking={{
				prefixes: ['spelieve.com'],
			}}
			theme={navigationTheme}
			documentTitle={{
				formatter: (options, route) => 'Spelieve ~旅のしおり簡単作成アプリ~',
			}}>
			<PaperProvider theme={paperTheme}>
				<AppProvider>
					<BottomTab.Navigator initialRouteName="Itinerary">
						<BottomTab.Screen
							name="Itinerary"
							component={ItineraryPageNavigator}
							options={{
								tabBarLabel: i18n.t('Itinerary'),
								tabBarIcon: 'book',
							}}
						/>
						<BottomTab.Screen
							name="Place"
							component={PlacePageNavigator}
							options={{
								tabBarLabel: i18n.t('Place'),
								tabBarIcon: 'map-search',
							}}
						/>
					</BottomTab.Navigator>
				</AppProvider>
			</PaperProvider>
		</NavigationContainer>
	);
};
export default App;

registerRootComponent(App);
