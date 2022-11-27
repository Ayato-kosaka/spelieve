import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItineraryEditPropsInterface } from 'spelieve-common/lib/Interfaces/Itinerary/IPA001';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { IPA001ItineraryEdit } from '@/Itinerary/Pages/IPA001ItineraryEdit';
import { IPA004ItineraryPreview } from '@/Itinerary/Pages/IPA004ItineraryPreview';

export type TopTabParamList = {
	IPA001ItineraryEdit: ItineraryEditPropsInterface;
	IPA004ItineraryPreview: ItineraryEditPropsInterface;
};

const Tab = createMaterialTopTabNavigator<TopTabParamList>();

export const INV002ItineraryTopTabNavigator = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'ItineraryTopTabNavigator'>) => {
	// TODO: Controller に移動する（ここから）
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);

	const onPressSetting = useCallback(() => {
		navigation.navigate('Itinerary', {
			screen: 'IPA002ItineraryCover',
			params: {
				itineraryID: itineraryDocSnap?.id,
			},
		});
	}, [itineraryDocSnap?.id, navigation]);

	// TODO: Controller に移動する（ここまで）

	const headerRight = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				<MaterialCommunityIcons name="export-variant" size={30} />
				<MaterialCommunityIcons name="cog" size={30} onPress={onPressSetting} />
			</View>
		),
		[onPressSetting],
	);

	useEffect(() => {
		navigation.setOptions({
			title: itineraryDocSnap?.data()?.title || '',
			headerRight,
		});
	}, [navigation, itineraryDocSnap, headerRight]);

	return (
		<Tab.Navigator initialRouteName="IPA001ItineraryEdit">
			<Tab.Screen
				name="IPA001ItineraryEdit"
				component={IPA001ItineraryEdit}
				initialParams={{}}
				options={{ title: i18n.t('編集') }}
			/>
			<Tab.Screen
				name="IPA004ItineraryPreview"
				component={IPA004ItineraryPreview}
				initialParams={{}}
				options={{ title: i18n.t('プレビュー') }}
			/>
		</Tab.Navigator>
	);
};
