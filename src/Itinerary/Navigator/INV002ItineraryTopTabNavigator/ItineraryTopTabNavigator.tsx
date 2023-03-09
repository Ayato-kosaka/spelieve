import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect } from 'react';

import { INV002ItineraryTopTabNavigatorController } from './ItineraryTopTabNavigatorController';

import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryTopTabParamList, ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { IPA001ItineraryEdit } from '@/Itinerary/Pages/IPA001ItineraryEdit';
import { IPA004ItineraryPreview } from '@/Itinerary/Pages/IPA004ItineraryPreview';

const Tab = createMaterialTopTabNavigator<ItineraryTopTabParamList>();

export const INV002ItineraryTopTabNavigator = ({
	route,
	navigation,
}: ItineraryStackScreenProps<'ItineraryTopTabNavigator'>) => {
	const { itinerary } = INV002ItineraryTopTabNavigatorController({
		route,
		navigation,
	});

	useEffect(() => {
		if (itinerary) {
			navigation.setOptions({
				title: '',
			});
		}
	}, [itinerary, navigation]);

	return (
		<Tab.Navigator initialRouteName="ItineraryEdit">
			<Tab.Screen
				name="ItineraryEdit"
				component={IPA001ItineraryEdit}
				initialParams={{}}
				options={{ title: i18n.t('Edit'), lazy: true }}
			/>
			<Tab.Screen
				name="ItineraryPreview"
				component={IPA004ItineraryPreview}
				initialParams={{}}
				options={{ title: i18n.t('Preview'), lazy: true }}
			/>
		</Tab.Navigator>
	);
};
