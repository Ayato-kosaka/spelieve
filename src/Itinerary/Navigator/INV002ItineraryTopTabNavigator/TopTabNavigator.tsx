import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ItineraryEditPropsInterface } from 'spelieve-common/lib/Interfaces/Itinerary/IPA001';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IPA001ItineraryEdit } from '@/Itinerary/Pages/IPA001ItineraryEdit';
import { IPA004ItineraryPreview } from '@/Itinerary/Pages/IPA004ItineraryPreview';


export type TopTabParamList = {
	IPA001ItineraryEdit: ItineraryEditPropsInterface;
	IPA004ItineraryPreview: ItineraryEditPropsInterface; // TODO: 要修正
};

const Tab = createMaterialTopTabNavigator<TopTabParamList>();

export function TopTabNavigator({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'TopTabNavigator'>) {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { isPreview, place_id, placeName } = route.params;

	// TODO: Controller に移動する（ここから）
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, planGroupsCRef } = useContext(ICT021PlanGroupsList);
	// TODO: Controller に移動する（ここまで）

	const headerRight = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				<MaterialCommunityIcons name="export-variant" size={30} />
				<MaterialCommunityIcons name="cog" size={30} />
			</View>
		),
		[],
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
}
