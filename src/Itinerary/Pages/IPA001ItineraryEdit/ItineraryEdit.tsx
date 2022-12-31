import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { ScrollView, ActivityIndicator, Button, View } from 'react-native';
import { Headline } from 'react-native-paper';

import { IPA001ItineraryEditController } from './ItineraryEditController';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03103PlanGroupsEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03103PlanGroupEdit';

export const IPA001ItineraryEdit = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA001ItineraryEdit'>) => {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, createPlanGroup } = useContext(ICT021PlanGroupsList);

	const { createItinerary } = IPA001ItineraryEditController({
		route,
		navigation,
	});

	if (!itineraryDocSnap || isPlansLoading || !planGroupsQSnap) {
		return <ActivityIndicator animating />;
	}

	if (!itineraryDocSnap.exists()) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		createItinerary();
		return <ActivityIndicator animating />;
	}

	let isAnotherDay = true;
	let prevDateNumber = 0;

	return (
		<ScrollView>
			{planGroupsQSnap?.docs.map((planGroupsDoc) => {
				const plnaGroup = planGroupsDoc.data();
				isAnotherDay = prevDateNumber !== plnaGroup.dayNumber;
				prevDateNumber = plnaGroup.dayNumber;
				return (
					<View key={planGroupsDoc.id}>
						{isAnotherDay && <Headline>{plnaGroup.dayNumber}日目</Headline>}
						<IMC03103PlanGroupsEdit planGroupsDoc={planGroupsDoc} />
					</View>
				);
			})}
			<Button
				title={i18n.t('予定グループを追加')}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					createPlanGroup();
				}}
			/>
		</ScrollView>
	);
};
