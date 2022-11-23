import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addDoc } from 'firebase/firestore';
import React, { useCallback, useContext, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT011';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03103PlanGroupsEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03103PlanGroupEdit';

export const IPA001ItineraryEdit = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA001ItineraryEdit'>) => {
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, planGroupsCRef } = useContext(ICT021PlanGroupsList);

	// TODO: あとで消す テスト用itineraryIDのメモ ?itineraryID=uMFhF6OQph2UUuKEsKNa

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { itineraryID, place_id, placeName } = route.params;

	// TODO: Conroller に移動する

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/335 Itinerary 新規作成
	const createItinerary = useCallback(async () => {
		if (itineraryDocSnap) {
			const itineray = await addDoc<ItineraryOneInterface>(itineraryDocSnap.ref.parent, {
				title: '',
				startDate: new Date(),
				tags: [],
				caption: '',
				isUpdatable: true,
				createdAt: DateUtils.initialDate(),
				updatedAt: DateUtils.initialDate(),
			});
			setItineraryID(itineray.id);
		}
	}, [itineraryDocSnap, setItineraryID]);

	if (!itineraryDocSnap || isPlansLoading || !planGroupsQSnap) {
		return <ActivityIndicator animating />;
	}

	if (!itineraryDocSnap.exists()) {
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
