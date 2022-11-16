import { Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { addDoc, deleteDoc, doc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo } from 'react';
import { Button, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export function IMC03102TrafficMovementEdit({
	planID,
	nextPlanID,
	planGroupsDoc,
}: {
	planID: string;
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	nextPlanID: string;
}) {
	const { plansCRef, plansDocSnapMap } = useContext(ICT031PlansMap);
	const plan = plansDocSnapMap[planID].data();
	const { place } = useContext(PCT012MPlaceOne);
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroups.plans.indexOf(planID), [planGroups]);

	const googleMapsClient = new Client({});

	// TODO: common hooks に外出しする
	const calculateDirection = () => {
		googleMapsClient.directions({
			params: {
				origin: `place_id:${plan.place_id}`,
				destination: `place_id:${nextPlanID}`,
				mode: 'driving',
				departure_time: 'now',
				key: ENV.GCP_API_KEY,
			},
		});
	};

	const addPlan = useCallback(async () => {
		const planDocRef = await addDoc(plansCRef!, {
			title: '',
			placeSpan: DateUtils.initialDate(),
			placeStartTime: DateUtils.initialDate(),
			placeEndTime: DateUtils.initialDate(),
			tags: [],
			transportationSpan: DateUtils.initialDate(),
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const newPlans = { ...planGroups.plans };
		newPlans.splice(plansIndex + 1, 0, planDocRef.id);
		await setDoc(planGroupsDoc.ref, { plans: newPlans }, { merge: true });
	}, [plansCRef, planGroups, planID, plansIndex]);

	const deletePlan = useCallback(async () => {
		const newPlans = { ...planGroups.plans };
		newPlans.splice(plansIndex, 1);
		await setDoc(planGroupsDoc.ref, { plans: newPlans }, { merge: true });
		await deleteDoc(doc(plansCRef!, planID));
	}, [plansCRef, planGroups, planID, plansIndex]);

	return (
		<View style={{ borderWidth: 1 }}>
			{nextPlanID && (
				<View>
					<MaterialCommunityIcons name="train" />
					<Text>
						{plan.transportationDepartureTime ? DateUtils.formatToHHMM(plan.transportationDepartureTime) : ''}
					</Text>
					<Text>~</Text>
					<Text>{plan.transportationArrivalTime ? DateUtils.formatToHHMM(plan.transportationArrivalTime) : ''}</Text>
				</View>
			)}
			<Button
				title={i18n.t('予定を追加')}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					addPlan();
				}}
			/>
			<Button
				title={i18n.t('予定を削除')}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					deletePlan();
				}}
			/>
		</View>
	);
}
