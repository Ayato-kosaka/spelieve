import { StatusBar } from 'expo-status-bar';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { IPA000Test } from '@/Itinerary/Pages/IPA000Test';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { PPA000DummyPage } from './Place/Page/PPA000DummyPage';

const styles = StyleSheet.create({
});

const Tab = createMaterialBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<PaperProvider>
					<Tab.Navigator
					initialRouteName="Itinerary"
					>
						<Tab.Screen name="Itinerary" component={IPA000Test} />
						<Tab.Screen name="Place" component={PPA000DummyPage} />
					</Tab.Navigator>
			</PaperProvider>
		</NavigationContainer>
	);
}

registerRootComponent(App);
