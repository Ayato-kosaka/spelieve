import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

import { IPA001ItineraryEditController } from './ItineraryEditController';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03103PlanGroupsEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03103PlanGroupEdit';

export const IPA001ItineraryEdit = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA001ItineraryEdit'>) => {
	const { itineraryDocSnap, itineraryCRef } = useContext(ICT011ItineraryOne);
	const { isPlansLoading } = useContext(ICT031PlansMap);
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);

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

	return (
		<ScrollView>
			{planGroupsQSnap?.docs.map((planGroupsDoc) => (
				<IMC03103PlanGroupsEdit key={planGroupsDoc.id} planGroupsDoc={planGroupsDoc} />
			))}
		</ScrollView>
	);
};
