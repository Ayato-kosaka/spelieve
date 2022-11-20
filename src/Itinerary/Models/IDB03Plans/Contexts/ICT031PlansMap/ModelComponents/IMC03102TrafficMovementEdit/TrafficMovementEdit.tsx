import { addDoc, deleteDoc, doc, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { Button, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlansMapInterface } from 'spelieve-common/lib/Interfaces';
import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT021';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { IMC03104EditDirectionsMode } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap/ModelComponents/IMC03104EditDirectionsMode';
import 'react-spring-bottom-sheet/dist/style.css';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const IMC03102TrafficMovementEdit = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
	nextPlanID,
}: {
	planID: string;
	beforeAfterRepresentativeType: 'before' | 'representative' | 'after';
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	dependentPlanID: string;
	isPlanGroupMounted: boolean;
	nextPlanID: string | undefined;
}) => {
	const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);

	const { plansCRef, plansDocSnapMap, travelModeConverter, transitModeConverter } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroups.plans.indexOf(planID), [planGroups, planID]);
	const dependentPlan = useMemo(() => plansDocSnapMap[dependentPlanID].data(), [dependentPlanID, plansDocSnapMap]);
	const nextPlan = useMemo(
		() => (nextPlanID ? plansDocSnapMap[nextPlanID].data() : undefined),
		[nextPlanID, plansDocSnapMap],
	);

	const transitOptions = useMemo(() => {
		if (plan.transportationMode === google.maps.TravelMode.TRANSIT) {
			const arrivalTime = beforeAfterRepresentativeType === 'before' ? dependentPlan.placeStartTime : undefined;
			const departureTime = ['representative', 'after'].includes(beforeAfterRepresentativeType)
				? plan.placeEndTime
				: undefined;
			return {
				arrivalTime,
				departureTime,
				modes: plan.transitModes,
				routingPreference: plan.transitRoutePreference,
			};
		}
		return undefined;
	}, [
		plan.transportationMode,
		beforeAfterRepresentativeType,
		dependentPlan,
		plan.placeEndTime,
		plan.transitModes,
		plan.transitRoutePreference,
	]);

	/** **********************************************************************************************
	 * Google Map Directions を用いて予定間の移動時間を計算する
	 *********************************************************************************************** */
	const calculateDirection = useCallback(async () => {
		if (!plan.transportationMode || !nextPlan || !plan.place_id || !nextPlan.place_id) {
			return;
		}
		const directionsService = new google.maps.DirectionsService();
		await directionsService
			.route(
				{
					origin: { placeId: plan.place_id },
					destination: { placeId: nextPlan.place_id }, // TODO 要修正
					travelMode: plan.transportationMode,
					avoidFerries: plan.avoidFerries,
					avoidHighways: plan.avoidHighways,
					avoidTolls: plan.avoidTolls,
					drivingOptions: {
						departureTime: plan.placeEndTime > new Date() ? plan.placeEndTime : new Date(),
						trafficModel: google.maps.TrafficModel.BEST_GUESS,
					},
					language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
					optimizeWaypoints: false,
					provideRouteAlternatives: false,
					region: undefined,
					transitOptions,
					unitSystem: undefined,
					waypoints: undefined,
				},
				(result, status) => {
					Logger('IMC03102TrafficMovementEdit', 'directionsService.route.result', planID);
					if (status === google.maps.DirectionsStatus.OK) {
						/** **********************************************************************************************
						 * DRIVING, WALKING, BICYCLING の場合 transportationSpan をレスポンスから設定する
						 * before の場合 transportationArrivalTime に次の予定の placeStartTime を設定し、
						 * *	transportationDepartureTime を transportationArrivalTime - transportationSpan で計算する
						 * after の場合 transportationDepartureTime に自分の予定の placeEndTime を設定し、
						 * *	transportationArrivalTime を transportationDepartureTime + transportationSpan で計算する
						 *********************************************************************************************** */
						if (
							plan.transportationMode &&
							[
								google.maps.TravelMode.DRIVING,
								google.maps.TravelMode.WALKING,
								google.maps.TravelMode.BICYCLING,
							].includes(plan.transportationMode)
						) {
							const transportationSpan: PlansMapInterface['transportationSpan'] = plan.placeSpan;
							transportationSpan.setDate(1);
							transportationSpan.setHours(0);
							transportationSpan.setMinutes(0);
							transportationSpan.setSeconds(result?.routes[0].legs[0].duration?.value || 0);
							const val: Pick<PlansMapInterface, 'transportationDepartureTime' | 'transportationArrivalTime'> = (() => {
								if (beforeAfterRepresentativeType === 'before') {
									return {
										transportationArrivalTime: dependentPlan.placeStartTime,
										transportationDepartureTime: DateUtils.subtraction(
											dependentPlan.placeStartTime,
											transportationSpan,
											['Hours', 'Minutes', 'Seconds'],
										),
									};
								}
								return {
									transportationDepartureTime: plan.placeEndTime,
									transportationArrivalTime: DateUtils.addition(plan.placeEndTime, transportationSpan, [
										'Hours',
										'Minutes',
										'Seconds',
									]),
								};
							})();
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							setDoc(planDocSnap.ref, { ...val, transportationSpan }, { merge: true });
						}
						// TODO: https://github.com/Ayato-kosaka/spelieve/issues/337 Transit での Directions が必ず "ZERO_RESULTS" を返す
					} else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
						/* ZERO_RESULTS の場合は、交通機関の特定に失敗しているため、TravelMode を undefined に変更する */
						// eslint-disable-next-line @typescript-eslint/no-floating-promises
						setDoc(
							planDocSnap.ref,
							{
								transportationMode: undefined,
							},
							{ merge: true },
						);
					}
				},
			)
			.catch((e) => {
				Logger('IMC03102TrafficMovementEdit', 'directionsService.route.catch', e);
			});
	}, [
		plan.place_id,
		planID,
		nextPlan,
		plan.avoidFerries,
		plan.avoidHighways,
		plan.avoidTolls,
		transitOptions,
		plan.transportationMode,
		plan.placeEndTime,
		dependentPlan,
		beforeAfterRepresentativeType,
		plan.placeSpan,
		planDocSnap,
	]);

	const cleatTransportationTime = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap.ref, {
			...plan,
			transportationSpan: DateUtils.initialDate(),
			transportationArrivalTime: undefined,
			transportationDepartureTime: undefined,
		});
	}, [plan, planDocSnap.ref]);

	// transportationMode を監視し、予定間の移動時間を再計算する
	// transportationMode が undefined であれば、予定間の移動時間を初期化する
	useEffect(() => {
		if (isPlanGroupMounted && plan.transportationMode) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			calculateDirection();
		} else if (isPlanGroupMounted && !plan.transportationMode) {
			cleatTransportationTime();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.transportationMode]);

	// 自分の予定の place_id を監視し、予定間の移動時間を再計算する
	// place_id が undefined であれば、予定間の移動時間を初期化する
	useEffect(() => {
		if (isPlanGroupMounted && plan.place_id) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			calculateDirection();
		} else if (isPlanGroupMounted && !plan.place_id) {
			cleatTransportationTime();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.place_id]);

	// 次の予定の place_id を監視し、予定間の移動時間を再計算する
	// 次の予定の place_id が undefined であれば、予定間の移動時間を初期化する
	useEffect(() => {
		if (isPlanGroupMounted && nextPlan?.place_id) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			calculateDirection();
		} else if (isPlanGroupMounted && !nextPlan?.place_id) {
			cleatTransportationTime();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nextPlan?.place_id]);

	const addPlan = useCallback(async () => {
		const planDocRef = await addDoc(plansCRef!, {
			title: '',
			placeSpan: DateUtils.initialDate(),
			placeStartTime: plan.transportationArrivalTime || plan.placeEndTime,
			placeEndTime: plan.transportationArrivalTime || plan.placeEndTime,
			tags: [],
			transportationSpan: DateUtils.initialDate(),
			avoidFerries: plan.avoidFerries,
			avoidHighways: plan.avoidHighways,
			avoidTolls: plan.avoidTolls,
			transitModes: plan.transitModes,
			transitRoutePreference: plan.transitRoutePreference,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		const newPlans = [...planGroups.plans];
		newPlans.splice(plansIndex + 1, 0, planDocRef.id);
		await setDoc(planGroupsDoc.ref, { plans: newPlans }, { merge: true });
	}, [
		plansCRef,
		planGroups,
		plansIndex,
		plan.placeEndTime,
		plan.transportationArrivalTime,
		plan.avoidFerries,
		plan.avoidHighways,
		plan.avoidTolls,
		plan.transitModes,
		plan.transitRoutePreference,
		planGroupsDoc.ref,
	]);

	const deletePlan = useCallback(async () => {
		const newPlans = [...planGroups.plans];
		newPlans.splice(plansIndex, 1);
		await setDoc(planGroupsDoc.ref, { plans: newPlans }, { merge: true });
		await deleteDoc(doc(plansCRef!, planID));
	}, [plansCRef, planGroups, planID, plansIndex, planGroupsDoc.ref]);

	return (
		<View style={{ borderWidth: 1 }}>
			{plan.place_id && nextPlan?.place_id && (
				<View>
					<Pressable
						onPress={() => {
							setBottomSheetVisible(true);
						}}>
						{plan.transportationMode ? (
							<MaterialCommunityIcons name={travelModeConverter[plan.transportationMode].iconName} />
						) : (
							<MaterialCommunityIcons name="checkbox-blank-circle" />
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
