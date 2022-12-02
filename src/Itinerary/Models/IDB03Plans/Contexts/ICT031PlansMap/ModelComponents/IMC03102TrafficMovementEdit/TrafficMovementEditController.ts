import { Client } from '@googlemaps/google-maps-services-js';
import { addDoc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo, useState, useEffect } from 'react';

import {
	TrafficMovementEditControllerInterface,
	TrafficMovementEditPropsInterface,
} from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import 'react-spring-bottom-sheet/dist/style.css';
import { ENV } from '@/ENV';

export const IMC03102TrafficMovementEditController = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
	nextPlanID,
}: TrafficMovementEditPropsInterface): TrafficMovementEditControllerInterface => {
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
		const client = new Client({});
		await client
			.directions({
				params: {
					key: ENV.GCP_API_KEY,
					origin: `place_id:${plan.place_id}`,
					destination: `placeId:${nextPlan.place_id}`,
					// mode: plan.transportationMode,
					// avoidFerries: plan.avoidFerries,
					// avoidHighways: plan.avoidHighways,
					// avoidTolls: plan.avoidTolls,
					// drivingOptions: {
					// 	departureTime: plan.placeEndTime > new Date() ? plan.placeEndTime : new Date(),
					// 	trafficModel: google.maps.TrafficModel.BEST_GUESS,
					// },
					// language: Object.keys(GooglePlaceLanguageTagFromIETFLanguageTag).includes(i18n.locale)
					// 	? Language[
					// 			GooglePlaceLanguageTagFromIETFLanguageTag[
					// 				(i18n.locale as keyof typeof GooglePlaceLanguageTagFromIETFLanguageTag)
					// 			]
					// 	  ]
					// 	: undefined,
					optimize: false,
					region: undefined,
					// transitOptions,
					waypoints: undefined,
				},
			})
			.then((value) => console.log(value));

		// const directionsService = new google.maps.DirectionsService();
		// directionsService.route(
		// 	{
		// 		origin: { placeId: plan.place_id },
		// 		destination: { placeId: nextPlan.place_id },
		// 		travelMode: plan.transportationMode,
		// 		avoidFerries: plan.avoidFerries,
		// 		avoidHighways: plan.avoidHighways,
		// 		avoidTolls: plan.avoidTolls,
		// 		drivingOptions: {
		// 			departureTime: plan.placeEndTime > new Date() ? plan.placeEndTime : new Date(),
		// 			trafficModel: google.maps.TrafficModel.BEST_GUESS,
		// 		},
		// 		language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
		// 		optimizeWaypoints: false,
		// 		provideRouteAlternatives: false,
		// 		region: undefined,
		// 		transitOptions,
		// 		unitSystem: undefined,
		// 		waypoints: undefined,
		// 	},
		// 	(result, status) => {
		// 		Logger('IMC03102TrafficMovementEdit', 'directionsService.route.result', planID);
		// 		if (status === google.maps.DirectionsStatus.OK) {
		// 			/** **********************************************************************************************
		// 			 * DRIVING, WALKING, BICYCLING の場合 transportationSpan をレスポンスから設定する
		// 			 * before の場合 transportationArrivalTime に次の予定の placeStartTime を設定し、
		// 			 * *	transportationDepartureTime を transportationArrivalTime - transportationSpan で計算する
		// 			 * after の場合 transportationDepartureTime に自分の予定の placeEndTime を設定し、
		// 			 * *	transportationArrivalTime を transportationDepartureTime + transportationSpan で計算する
		// 			 *********************************************************************************************** */
		// 			if (
		// 				plan.transportationMode &&
		// 				[google.maps.TravelMode.DRIVING, google.maps.TravelMode.WALKING, google.maps.TravelMode.BICYCLING].includes(
		// 					plan.transportationMode,
		// 				)
		// 			) {
		// 				const transportationSpan: PlansMapInterface['transportationSpan'] = plan.placeSpan;
		// 				transportationSpan.setDate(1);
		// 				transportationSpan.setHours(0);
		// 				transportationSpan.setMinutes(0);
		// 				transportationSpan.setSeconds(result?.routes[0].legs[0].duration?.value || 0);
		// 				const val: Pick<PlansMapInterface, 'transportationDepartureTime' | 'transportationArrivalTime'> = (() => {
		// 					if (beforeAfterRepresentativeType === 'before') {
		// 						return {
		// 							transportationArrivalTime: dependentPlan.placeStartTime,
		// 							transportationDepartureTime: DateUtils.subtraction(dependentPlan.placeStartTime, transportationSpan, [
		// 								'Hours',
		// 								'Minutes',
		// 								'Seconds',
		// 							]),
		// 						};
		// 					}
		// 					return {
		// 						transportationDepartureTime: plan.placeEndTime,
		// 						transportationArrivalTime: DateUtils.addition(plan.placeEndTime, transportationSpan, [
		// 							'Hours',
		// 							'Minutes',
		// 							'Seconds',
		// 						]),
		// 					};
		// 				})();
		// 				// eslint-disable-next-line @typescript-eslint/no-floating-promises
		// 				setDoc(planDocSnap.ref, { ...val, transportationSpan }, { merge: true });
		// 			}
		// 			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/337 Transit での Directions が必ず "ZERO_RESULTS" を返す
		// 		} else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
		// 			/* ZERO_RESULTS の場合は、交通機関の特定に失敗しているため、TravelMode を undefined に変更する */
		// 			// eslint-disable-next-line @typescript-eslint/no-floating-promises
		// 			setDoc(
		// 				planDocSnap.ref,
		// 				{
		// 					transportationMode: undefined,
		// 				},
		// 				{ merge: true },
		// 			);
		// 		}
		// 	},
		// );
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

	return { addPlan, bottomSheetVisible, setBottomSheetVisible };
};
