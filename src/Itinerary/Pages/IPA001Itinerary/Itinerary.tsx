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
import { ICT031PlansMap, ICT031PlansMapProvider } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';
import { PCT012MPlaceOneProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';
import { CCT002Modal } from '@/Common/Context/CCT002Modal';

function InnerComponent2() {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const itinerary = itineraryDocSnap.data();
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const { setModalVal} = useContext(CCT002Modal);

	const onSettingClicked = () => {
		setModalVal(val => ({...val, visible: true, modalContent: <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>}))
	}
	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={itinerary?.title} />
				<Appbar.Action icon="export-variant" />
				<Appbar.Action icon="cog" onPress={onSettingClicked} />
			</Appbar.Header>
			<View>
				<Text>{i18n.t('編集')}</Text>
				<Text>{i18n.t('プレビュー')}</Text>
			</View>
			{planGroupsQSnap.docs.map((planGroupsDoc) => (
				<View key={planGroupsDoc.id} style={{ width: '100%' }}>
					{planGroupsDoc.data().plans.map((planID) => (
						<PCT012MPlaceOneProvider place_id={plansDocSnapMap[planID].data().place_id} language="ja" key={planID}>
							{/*　https://github.com/Ayato-kosaka/spelieve/issues/281　初期language検討 */}
							<IMC03101PlanEdit planID={planID} />
							<IMC03102TrafficMovementEdit planID={planID} />
						</PCT012MPlaceOneProvider>
					))}
				</View>
			))}
		</>
	);
}

function InnerComponent1() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	return (
		<ICT031PlansMapProvider parentDocRef={useICT011ItineraryOne.itineraryDocSnap.ref}>
			<ICT021PlanGroupsListProvider parentDocRef={useICT011ItineraryOne.itineraryDocSnap.ref}>
				<InnerComponent2 />
			</ICT021PlanGroupsListProvider>
		</ICT031PlansMapProvider>
	);
}

export function IPA001Itinerary({
	id = 'uMFhF6OQph2UUuKEsKNa', // TODO: ''に修正する。
}) {
	const docRef = doc(collection(db, Itineraries.modelName), id);
	return (
		<ICT011ItineraryOneProvider docRef={docRef}>
			<InnerComponent1 />
		</ICT011ItineraryOneProvider>
	);
}
