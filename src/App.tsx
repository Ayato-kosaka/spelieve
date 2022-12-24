import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { AppProvider } from './AppProvider';
import { Logger } from './Common/Hooks/CHK001Utils';
import i18n from './Common/Hooks/i18n-js';
import { ItineraryPageNavigator, ItineraryStackParamList } from './Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator, PlaceStackParamList } from './Place/Pages/PlacePageNavigator/PlacePageNavigator';
import { theme } from './ThemeProvider';

export type BottomTabParamList = {
	Itinerary: NavigatorScreenParams<ItineraryStackParamList>;
	Place: NavigatorScreenParams<PlaceStackParamList>;
} & ItineraryStackParamList &
	PlaceStackParamList;

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export const App = () => {
	useEffect(() => {
		if (Platform.OS !== 'web') {
			ImagePicker.requestMediaLibraryPermissionsAsync()
				.then((res) => {
					if (res.status !== 'granted') {
						// TODO: aleart を modal に修正する
						// eslint-disable-next-line no-alert
						alert('Sorry, we need camera roll permissions to make this work!');
					}
				})
				.catch((e) => Logger('App', 'useEffect.requestMediaLibraryPermissionsAsync.e', e));
		}
	});

	return (
		<NavigationContainer
			linking={{
				prefixes: ['spelieve.com'],
			}}>
			<PaperProvider theme={theme}>
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
