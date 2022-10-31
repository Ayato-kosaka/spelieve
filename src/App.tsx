import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { PPA000DummyPage } from './Place/Page/PPA000DummyPage';

import { IPA000Test } from '@/Itinerary/Pages/IPA000Test';
import i18n from './Common/Hooks/i18n-js';

const styles = StyleSheet.create({});

const Tab = createMaterialBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<PaperProvider>
				<Tab.Navigator initialRouteName="Itinerary">
					<Tab.Screen
						name="Itinerary"
						component={IPA000Test}
						options={{
							tabBarLabel: i18n.t('Itinerary'),
							tabBarIcon: 'book',
						}}
					/>
					<Tab.Screen
						name="Place"
						component={PPA000DummyPage}
						options={{
							tabBarLabel: i18n.t('Place'),
							tabBarIcon: 'map-search',
						}}
					/>
				</Tab.Navigator>
			</PaperProvider>
		</NavigationContainer>
	);
}

registerRootComponent(App);
