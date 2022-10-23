import { collection, doc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';

import i18n from '@/Common/Hooks/i18n-js';
import db from '@/Itinerary/Endpoint/firestore';
import {
	ICT011ItineraryOne,
	ICT011ItineraryOneProvider,
} from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import {
	ICT021PlanGroupsList,
	ICT021PlanGroupsListProvider,
} from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';


function InnerComponent3() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	const itinerary = useICT011ItineraryOne.itineraryDocSnap.data();
	const useICT021PlanGroupsList = useContext(ICT021PlanGroupsList);
	console.log('InnerComponent3', useICT021PlanGroupsList.planGroupsQSnap.docs[0].data());
	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={itinerary?.title} />
				<Appbar.Action icon="" />
				<Appbar.Action icon="" />
			</Appbar.Header>
			<View>
				<Text>{i18n.t('編集')}</Text>
				<Text>{i18n.t('プレビュー')}</Text>
			</View>
			{useICT021PlanGroupsList.planGroupsQSnap.docs.map((planGroupsDoc) => (
				<>
					{planGroupsDoc.data().plans.map((planID) => (
						<IMC03101PlanEdit planID={planID} />
					))}
				</>
			))}
		</>
	);
}

function InnerComponent2() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	return (
		<ICT021PlanGroupsListProvider parentDocRef={useICT011ItineraryOne.itineraryDocSnap.ref}>
			<InnerComponent3 />
		</ICT021PlanGroupsListProvider>
	);
}

function InnerComponent1() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	return (
		<ICT031PlansMapProvider parentDocRef={useICT011ItineraryOne.itineraryDocSnap.ref}>
			<InnerComponent2 />
		</ICT031PlansMapProvider>
	);
}

export function IPA001Itinerary({
	id = 'nzEQO5MhckDefM4MsAC7' // TODO: ''に修正する。
}) {
	const docRef = doc(collection(db, Itineraries.modelName), id);
	return (
		<ICT011ItineraryOneProvider docRef={docRef}>
			<InnerComponent1 />
		</ICT011ItineraryOneProvider>
	);
}
