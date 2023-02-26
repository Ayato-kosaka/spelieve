/* eslint-disable @typescript-eslint/no-use-before-define */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef } from 'react';

import i18n from '../Hooks/i18n-js';
import { ModalScreen } from '../Pages/ModalScreen';
import { NotFoundScreen } from '../Pages/NotFoundScreen';

import { LinkingConfiguration } from './LinkingConfiguration';
import { RootStackParamList, RootTabParamList } from './NavigationInterface';

import { sendAnalyticsLogEvent } from '@/Common/Hooks/Analytics/Analytics';
import { ItineraryPageNavigator } from '@/Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator } from '@/Place/Pages/PlacePageNavigator/PlacePageNavigator';
import { navigationTheme } from '@/ThemeProvider';
import { ThumbnailPageNavigator } from '@/Thumbnail/Pages/ThumbnailPageNavigator';

export const Navigation = () => {
	const navigationRef = useNavigationContainerRef<RootStackParamList>();
	const routeNameRef = useRef<string | undefined>('');

	const handlePageChanged = async (): Promise<void> => {
		const previousRouteName: string | undefined = routeNameRef.current;
		const currentRouteName: string | undefined = navigationRef.current?.getCurrentRoute()?.name;

		if (previousRouteName !== currentRouteName && currentRouteName) {
			await sendAnalyticsLogEvent(currentRouteName, {
				screen_class: currentRouteName,
			});
		}
		routeNameRef.current = currentRouteName;
	};

	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={navigationTheme}
			documentTitle={{
				formatter: (options, route) => 'Spelieve ~旅のしおり簡単作成アプリ~',
			}}
			ref={navigationRef}
			onReady={() => {
				routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
			}}
			onStateChange={() => handlePageChanged()}>
			<RootNavigator />
		</NavigationContainer>
	);
};

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
		<Stack.Screen name="ThumbnailPageNavigator" component={ThumbnailPageNavigator} options={{ headerShown: false }} />
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
