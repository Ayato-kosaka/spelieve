import { addDoc, deleteDoc, doc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, FlatList, Pressable, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import i18n from '@/Common/Hooks/i18n-js';

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
	const planDocSnap = plansDocSnapMap[planID];
	const plan = planDocSnap.data();
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroups.plans.indexOf(planID), [planGroups]);

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
	}, []);

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
			{/* TO @Takapy: BottomSheetのコンポーネントがiOSで使えるか確認してほしい！ */}
			<BottomSheet
				open={bottomSheetVisible}
				onDismiss={() => {
					setBottomSheetVisible(false);
				}}
				snapPoints={({ minHeight }) => minHeight}>
				<FlatList
					data={[
						google.maps.TravelMode.WALKING,
						google.maps.TravelMode.BICYCLING,
						google.maps.TravelMode.DRIVING,
						google.maps.TravelMode.TRANSIT,
					]}
					horizontal
					renderItem={(renderItemInfo) => (
						<Pressable
							onPress={() => {
								setDoc(planDocSnap.ref, { transportationMode: renderItemInfo.item }, { merge: true });
								setBottomSheetVisible(false);
							}}
							style={{
								flexDirection: 'column',
								alignItems: 'center',
								backgroundColor: renderItemInfo.item === plan.transportationMode ? 'red' : 'white',
							}}>
							<MaterialCommunityIcons name={travelModeConverter[renderItemInfo.item].iconName} />
							<Text>{travelModeConverter[renderItemInfo.item].title}</Text>
						</Pressable>
					)}
					contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-around' }}
				/>
				<Divider />
				{plan.transportationMode === google.maps.TravelMode.TRANSIT && (
					<>
						<FlatList
							data={[
								google.maps.TransitMode.BUS,
								google.maps.TransitMode.RAIL,
								google.maps.TransitMode.SUBWAY,
								google.maps.TransitMode.TRAIN,
								google.maps.TransitMode.TRAM,
							]}
							horizontal
							renderItem={(renderItemInfo) => (
								<Pressable
									onPress={() => {
										const transitModes = [...plan.transitModes];
										if (transitModes.includes(renderItemInfo.item)) {
											transitModes.splice(transitModes.indexOf(renderItemInfo.item), 1);
										} else {
											transitModes.push(renderItemInfo.item);
										}
										setDoc(planDocSnap.ref, { transitModes }, { merge: true });
									}}
									style={{
										flexDirection: 'column',
										alignItems: 'center',
										backgroundColor: plan.transitModes.includes(renderItemInfo.item) ? 'red' : 'white',
									}}>
									<MaterialCommunityIcons name={transitModeConverter[renderItemInfo.item].iconName} />
									<Text>{transitModeConverter[renderItemInfo.item].title}</Text>
								</Pressable>
							)}
							contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-around' }}
						/>
						<Divider />
						<Pressable
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() =>
								setDoc(
									planDocSnap.ref,
									{ transitRoutePreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS },
									{ merge: true },
								)
							}>
							<Text>{i18n.t('乗り換えが少ないルート')}</Text>
							<MaterialCommunityIcons
								name={plan.transitRoutePreference === google.maps.TransitRoutePreference.FEWER_TRANSFERS ? 'check' : ''}
							/>
						</Pressable>
						<Pressable
							style={{ flexDirection: 'row', alignItems: 'center' }}
							onPress={() =>
								setDoc(
									planDocSnap.ref,
									{ transitRoutePreference: google.maps.TransitRoutePreference.LESS_WALKING },
									{ merge: true },
								)
							}>
							<Text>{i18n.t('歩きが少ないルート')}</Text>
							<MaterialCommunityIcons
								name={plan.transitRoutePreference === google.maps.TransitRoutePreference.LESS_WALKING ? 'check' : ''}
							/>
						</Pressable>
						<Divider />
					</>
				)}
				<Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text>{i18n.t('Avoid highways')}</Text>
					<MaterialCommunityIcons name="" />
				</Pressable>
				<Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text>{i18n.t('Avoid tolls')}</Text>
					<MaterialCommunityIcons name="check" />
				</Pressable>
				<Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text>{i18n.t('Avoid ferries')}</Text>
					<MaterialCommunityIcons name="check" />
				</Pressable>
				<Button
					title={i18n.t('決定')}
					onPress={() => {
						setBottomSheetVisible(false);
					}}
				/>
			</BottomSheet>
		</View>
	);
};
