import { addDoc, deleteDoc, doc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Modal, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';


export const IMC03102TrafficMovementEdit = ({
	planID,
	nextPlanID,
	planGroupsDoc,
}: {
	planID: string;
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	nextPlanID: string;
}) => {
	const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);

	const { plansCRef, plansDocSnapMap } = useContext(ICT031PlansMap);
	const plan = plansDocSnapMap[planID].data();
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroups.plans.indexOf(planID), [planGroups]);

	const calculateDirection = useCallback(async () => {
		const directionsService = new google.maps.DirectionsService();
		const directionsRouteResponse = await directionsService.route({
			origin: {placeId: 'ChIJ01v4evpZGGARl4P3h_7FCV0'},
			destination: {placeId: 'ChIJszdHEQN9GGARJS23SnAdR0E'},
			travelMode: google.maps.TravelMode.TWO_WHEELER
			// transitOptions: {
			// 	modes: [google.maps.TransitMode.TRAIN]
			// }
		})
		console.log(directionsRouteResponse)
	}, []);

	const addPlan = useCallback(async () => {
		// TODO: 設定値は要検討
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
				title={i18n.t('calculateDirection')}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					calculateDirection();
				}}
			/>
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
			<Button title='show modal' onPress={()=>{setBottomSheetVisible(true)}} />
			{/* <Modal
			  animationType="slide"
			  transparent={true}
			  statusBarTranslucent={true}
			  visible={bottomSheetVisible}
			  onRequestClose={() => {
				setBottomSheetVisible(false);
			  }}
			>

			</Modal> */}
		</View>
	);
}
