/* eslint-disable @typescript-eslint/no-use-before-define */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import i18n from '../Hooks/i18n-js';
import { ModalScreen } from '../Pages/ModalScreen';
import { NotFoundScreen } from '../Pages/NotFoundScreen';

import { LinkingConfiguration } from './LinkingConfiguration';
import { RootStackParamList, RootTabParamList } from './NavigationInterface';

import { ItineraryPageNavigator } from '@/Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator } from '@/Place/Pages/PlacePageNavigator/PlacePageNavigator';
import { navigationTheme } from '@/ThemeProvider';

export const Navigation = () => (
	<NavigationContainer
		linking={LinkingConfiguration}
		theme={navigationTheme}
		documentTitle={{
			formatter: (options, route) => 'Spelieve ~旅のしおり簡単作成アプリ~',
		}}>
		<RootNavigator />
	</NavigationContainer>
);

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
		<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
		<Stack.Group screenOptions={{ presentation: 'modal' }}>
			<Stack.Screen name="Modal" component={ModalScreen} />
		</Stack.Group>
	</Stack.Navigator>
);

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => (
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
);
