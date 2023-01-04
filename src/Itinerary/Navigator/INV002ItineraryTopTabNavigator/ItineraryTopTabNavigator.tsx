import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItineraryEditPropsInterface } from 'spelieve-common/lib/Interfaces/Itinerary/IPA001';

import { INV002ItineraryTopTabNavigatorController } from './ItineraryTopTabNavigatorController';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { IPA001ItineraryEdit } from '@/Itinerary/Pages/IPA001ItineraryEdit';
import { IPA004ItineraryPreview } from '@/Itinerary/Pages/IPA004ItineraryPreview';

export type TopTabParamList = {
	ItineraryEdit: ItineraryEditPropsInterface;
	ItineraryPreview: ItineraryEditPropsInterface;
};

const Tab = createMaterialTopTabNavigator<TopTabParamList>();

export const INV002ItineraryTopTabNavigator = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'TopTab'>) => {
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
