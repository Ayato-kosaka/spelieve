import { addDoc, deleteDoc, doc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import i18n from '@/Common/Hooks/i18n-js';
import { IMC03104EditDirectionsMode } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03104EditDirectionsMode';
import 'react-spring-bottom-sheet/dist/style.css';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

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

	const { plansCRef, plansDocSnapMap, travelModeConverter, transitModeConverter } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroups.plans.indexOf(planID), [planGroups, planID]);

	const calculateDirection = useCallback(async () => {
		if (!plan.transportationMode) {
			return;
		}
		const directionsService = new google.maps.DirectionsService();
		const directionsRouteResponse = await directionsService.route({
			destination: { placeId: 'ChIJszdHEQN9GGARJS23SnAdR0E' }, // TODO 要修正
			origin: { placeId: 'ChIJ01v4evpZGGARl4P3h_7FCV0' }, // TODO 要修正
			travelMode: plan.transportationMode,
			avoidFerries: plan.avoidFerries,
			avoidHighways: plan.avoidHighways,
			avoidTolls: plan.avoidTolls,
			drivingOptions: {
				departureTime: plan.transportationDepartureTime!, // TODO 要修正
				trafficModel: google.maps.TrafficModel.BEST_GUESS,
			},
			language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
			optimizeWaypoints: false,
			provideRouteAlternatives: false,
			region: undefined,
			transitOptions: {
				arrivalTime: plan.transportationArrivalTime, // TODO 要修正
				departureTime: plan.transportationDepartureTime, // TODO 要修正
				modes: plan.transitModes,
				routingPreference: plan.transitRoutePreference,
			},
			unitSystem: undefined,
			waypoints: undefined,
		});
		console.log(directionsRouteResponse);
	}, [
		plan.avoidFerries,
		plan.avoidHighways,
		plan.avoidTolls,
		plan.transitModes,
		plan.transitRoutePreference,
		plan.transportationArrivalTime,
		plan.transportationDepartureTime,
		plan.transportationMode,
	]);

	const addPlan = useCallback(async () => {
		// TODO: 設定値は要検討
		const planDocRef = await addDoc(plansCRef!, {
			title: '',
			placeSpan: DateUtils.initialDate(),
			placeStartTime: plan.transportationArrivalTime || plan.placeEndTime,
			placeEndTime: DateUtils.initialDate(),
			tags: [],
			transportationSpan: DateUtils.initialDate(),
			avoidFerries: false,
			avoidHighways: false,
			avoidTolls: false,
			transitModes: [
				google.maps.TransitMode.BUS,
				google.maps.TransitMode.RAIL,
				google.maps.TransitMode.SUBWAY,
				google.maps.TransitMode.TRAIN,
				google.maps.TransitMode.TRAM,
			],
			transitRoutePreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const newPlans = { ...planGroups.plans };
		newPlans.splice(plansIndex + 1, 0, planDocRef.id);
		await setDoc(planGroupsDoc.ref, { plans: newPlans }, { merge: true });
	}, [plansCRef, planGroups, plansIndex, plan.placeEndTime, plan.transportationArrivalTime, planGroupsDoc.ref]);

	const deletePlan = useCallback(async () => {
		const newPlans = { ...planGroups.plans };
		newPlans.splice(plansIndex, 1);
		await setDoc(planGroupsDoc.ref, { plans: newPlans }, { merge: true });
		await deleteDoc(doc(plansCRef!, planID));
	}, [plansCRef, planGroups, planID, plansIndex, planGroupsDoc.ref]);

	return (
		<View style={{ borderWidth: 1 }}>
			{nextPlanID && (
				<View>
					<Pressable
						onPress={() => {
							setBottomSheetVisible(true);
						}}>
						{plan.transportationMode && (
							<MaterialCommunityIcons name={travelModeConverter[plan.transportationMode].iconName} />
						)}
					</Pressable>
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
			<IMC03104EditDirectionsMode
				planID={planID}
				bottomSheetVisible={bottomSheetVisible}
				setBottomSheetVisible={setBottomSheetVisible}
			/>
		</View>
	);
};
