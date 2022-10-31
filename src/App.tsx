import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import i18n from './Common/Hooks/i18n-js';
import { ItineraryPageNavigator, ItineraryStackParamList } from './Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator, PlaceStackParamList } from './Place/Page/PlacePageNavigator';

const styles = StyleSheet.create({});

export type BottomTabParamList = {
	Itinerary: NavigatorScreenParams<ItineraryStackParamList>;
	Place: NavigatorScreenParams<PlaceStackParamList>;
} & ItineraryStackParamList;

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export default function App() {
	return (
		<NavigationContainer
			linking={{
				prefixes: ['spelieve.com'],
			}}>
			<PaperProvider>
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
			</PaperProvider>
		</NavigationContainer>
	);
}

registerRootComponent(App);
