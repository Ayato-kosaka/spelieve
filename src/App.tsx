import { LoadScript } from '@react-google-maps/api';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Provider as PaperProvider } from 'react-native-paper';

import i18n from './Common/Hooks/i18n-js';
import { ENV } from './ENV';
import { ItineraryPageNavigator, ItineraryStackParamList } from './Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator, PlaceStackParamList } from './Place/Pages/PlacePageNavigator/PlacePageNavigator';

export type BottomTabParamList = {
	Itinerary: NavigatorScreenParams<ItineraryStackParamList>;
	Place: NavigatorScreenParams<PlaceStackParamList>;
} & ItineraryStackParamList &
	PlaceStackParamList;

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export const App = () => (
	<NavigationContainer
		linking={{
			prefixes: ['spelieve.com'],
		}}>
		<PaperProvider>
			<LoadScript googleMapsApiKey={ENV.GCP_API_KEY}>
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
			</LoadScript>
		</PaperProvider>
	</NavigationContainer>
);
export default App;

registerRootComponent(App);
