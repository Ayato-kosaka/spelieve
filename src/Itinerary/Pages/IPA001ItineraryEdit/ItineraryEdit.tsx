import { addDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import { ItineraryOneInterface, ItinerarypropsInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { IMC03101PlanEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03101PlanEdit';
import { IMC03102TrafficMovementEdit } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03102TrafficMovementEdit';
import { PCT012MPlaceOneProvider } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export function IPA001ItineraryEdit({
	itinearyID = 'uMFhF6OQph2UUuKEsKNa', // TODO: ''に修正する。
}: ItinerarypropsInterface) {
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, planGroupsCRef } = useContext(ICT021PlanGroupsList);

	useEffect(() => {
		if (itinearyID) {
			setItineraryID(itinearyID);
		}
	}, [itinearyID, setItineraryID]);

	if (!itineraryDocSnap || isPlansLoading || !planGroupsQSnap) {
		return <ActivityIndicator animating />;
	}

	if (!itineraryDocSnap.exists()) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		addDoc<ItineraryOneInterface>(itineraryDocSnap.ref.parent, {
			title: '',
			caption: '',
			createdAt: DateUtils.initialDate(),
			updatedAt: DateUtils.initialDate(),
		});
		return <ActivityIndicator animating />;
	}

	const itinerary: ItineraryOneInterface = itineraryDocSnap.data();

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
						<PCT012MPlaceOneProvider place_id={plansDocSnapMap[planID].data().place_id} language="ja" key={planID}>
							{/*　https://github.com/Ayato-kosaka/spelieve/issues/286 Provider を App.tsxに移動する */}
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
