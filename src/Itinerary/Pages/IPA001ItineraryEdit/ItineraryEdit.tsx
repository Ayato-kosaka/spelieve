import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addDoc } from 'firebase/firestore';
import { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';
import { PCT012MPlaceOneProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export function IPA001ItineraryEdit({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA001ItineraryEdit'>) {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { itineraryID, isPreview, place_id, placeName } = route.params;
	

	// TOD: あとで消す ?itineraryID=uMFhF6OQph2UUuKEsKNa

	// TODO: Controller に移動する（ここから）
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, planGroupsCRef } = useContext(ICT021PlanGroupsList);
	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);
	// TODO: Controller に移動する（ここまで）

	if (!itineraryDocSnap || isPlansLoading || !planGroupsQSnap) {
		return <ActivityIndicator animating />;
	}

	if (!itineraryDocSnap.exists()) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		addDoc<ItineraryOneInterface>(itineraryDocSnap.ref.parent, {
			title: '',
			startDate: new Date(),
			tags: [],
			caption: '',
			isUpdatable: true,
			createdAt: DateUtils.initialDate(),
			updatedAt: DateUtils.initialDate(),
		});
		return <ActivityIndicator animating />;
	}
	

	const itinerary: ItineraryOneInterface = itineraryDocSnap.data();
	
	navigation.setOptions({title: itinerary.title,})

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={itinerary?.title} />
				<Appbar.Action icon="export-variant" />
				<Appbar.Action icon="cog" />
			</Appbar.Header>
			<View>
				<Text>{i18n.t('編集')}</Text>
				<Text>{i18n.t('プレビュー')}</Text>
			</View>
			{planGroupsQSnap.docs.map((planGroupsDoc) => (
				<View key={planGroupsDoc.id} style={{ width: '100%' }}>
					{planGroupsDoc.data().plans.map((planID) => (
						<>
							<IMC03101PlanEdit planID={planID} />
							<IMC03102TrafficMovementEdit planID={planID} />
						</>
					))}
				</View>
			))}
		</>
	);
}
