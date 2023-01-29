import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
	const { itinerary, onPressSetting } = INV002ItineraryTopTabNavigatorController({
		route,
		navigation,
	});

	const headerRight = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				{/* <MaterialCommunityIcons name="export-variant" size={30} /> */}
				<MaterialCommunityIcons name="cog" size={30} onPress={onPressSetting} />
			</View>
		),
		[onPressSetting],
	);

	useEffect(() => {
		if (itinerary) {
			navigation.setOptions({
				title: itinerary?.title || '',
				headerRight,
			});
		}
	}, [itinerary, headerRight, navigation]);

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
