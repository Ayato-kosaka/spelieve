/* eslint-disable @typescript-eslint/no-use-before-define */
import perf from '@react-native-firebase/perf';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRef } from 'react';
import { Platform } from 'react-native';

import { CCO001GlobalContext } from '../Components/CCO001GlobalContext/GlobalContext';
import { consoleError } from '../Hooks/CHK001Utils';
import i18n from '../Hooks/i18n-js';
import { ModalScreen } from '../Pages/ModalScreen';
import { NotFoundScreen } from '../Pages/NotFoundScreen';

import { LinkingConfiguration } from './LinkingConfiguration';
import { RootStackParamList, BottomTabNavigatorParamList, RootStackScreenProps } from './NavigationInterface';

import { CHK006GoogleAnalytics } from '@/Common/Hooks/CHK006GoogleAnalytics/GoogleAnalytics';
import { IPA003EditPlan } from '@/Itinerary/Pages/IPA003EditPlan';
import { ItineraryPageNavigator } from '@/Itinerary/Pages/ItineraryPageNavigator';
import { PlacePageNavigator } from '@/Place/Pages/PlacePageNavigator/PlacePageNavigator';
import { navigationTheme } from '@/ThemeProvider';
import { ThumbnailPageNavigator } from '@/Thumbnail/Pages/ThumbnailPageNavigator';

export const Navigation = () => {
	const navigationRef = useNavigationContainerRef<RootStackParamList>();
	const routeNameRef = useRef<string | undefined>('');

	const onStateChange = () => {
		const previousRouteName: string | undefined = routeNameRef.current;
		const currentRouteName: string | undefined = navigationRef.current?.getCurrentRoute()?.name;

		const trackScreenView = async (screenName: string) => {
			CHK006GoogleAnalytics.sendAnalyticsLogEvent('screen_view', {
				firebase_screen: screenName,
				firebase_screen_class: screenName,
			});

			// Screen Rendering Performance Monitoring
			if (Platform.OS === 'android') {
				const trace = perf().newScreenTrace(screenName);
				await trace.start();
				await trace.stop();
			}
		};

		if (previousRouteName !== currentRouteName && currentRouteName) {
			routeNameRef.current = currentRouteName;
			if (currentRouteName) {
				trackScreenView(currentRouteName).catch((e) => consoleError('Navigation', 'onStateChange.trackScreenView', e));
			}
		}
	};

	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={navigationTheme}
			documentTitle={{
				formatter: (options, route) => i18n.t('Spelieve ~旅のしおり簡単作成アプリ~'),
			}}
			ref={navigationRef}
			onReady={() => {
				routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
			}}
			onStateChange={() => onStateChange()}>
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
	<CCO001GlobalContext>
		<Stack.Navigator>
			<Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen
				name="ThumbnailPageNavigator"
				component={ThumbnailPageNavigator}
				options={{ headerShown: false, gestureEnabled: false }}
			/>
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen name="Modal" component={ModalScreen} />
				<Stack.Screen
					name="EditPlan"
					component={IPA003EditPlan}
					initialParams={{}}
					options={{ title: i18n.t('Plan setting') }}
				/>
			</Stack.Group>
		</Stack.Navigator>
	</CCO001GlobalContext>
);

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createMaterialBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabNavigator = ({ navigation, route }: RootStackScreenProps<'BottomTabNavigator'>) => (
	<BottomTab.Navigator initialRouteName="Itinerary" barStyle={{ backgroundColor: 'white' }}>
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
