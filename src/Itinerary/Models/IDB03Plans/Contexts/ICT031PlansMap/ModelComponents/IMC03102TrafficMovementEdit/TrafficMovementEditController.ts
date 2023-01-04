import { DirectionsRequest, DirectionsResponse, TrafficModel, TravelMode } from '@googlemaps/google-maps-services-js';
import { addDoc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useMemo, useState, useEffect } from 'react';

import {
	PlansMapInterface,
	TrafficMovementEditControllerInterface,
	TrafficMovementEditPropsInterface,
} from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { PlaceHttpPost } from '@/Place/Endpoint/PlaceHttpPost';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const IMC03102TrafficMovementEditController = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
	nextPlanID,
}: TrafficMovementEditPropsInterface): TrafficMovementEditControllerInterface => {
	const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);

	const { plansCRef, plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);
	const planGroups = useMemo(() => planGroupsDoc.data(), [planGroupsDoc]);
	const plansIndex = useMemo(() => planGroups.plans.indexOf(planID), [planGroups, planID]);
	const dependentPlan = useMemo(() => plansDocSnapMap[dependentPlanID].data(), [dependentPlanID, plansDocSnapMap]);
	const nextPlan = useMemo(
		() => (nextPlanID ? plansDocSnapMap[nextPlanID].data() : undefined),
		[nextPlanID, plansDocSnapMap],
	);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const arrival_time = useMemo(() => {
		// TODO: plan.transportationMode === TravelMode.transit && beforeAfterRepresentativeType === 'before' ?
		if (beforeAfterRepresentativeType === 'before') {
			if (plan.transportationMode === TravelMode.transit) {
				return dependentPlan.placeStartTime;
			}
			return undefined;
		}
		return undefined;
	}, [plan.transportationMode, beforeAfterRepresentativeType, dependentPlan.placeStartTime]);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const departure_time = useMemo(() => {
		if (['representative', 'after'].includes(beforeAfterRepresentativeType)) {
			if (plan.transportationMode === TravelMode.transit) {
				return plan.placeEndTime.getTime();
			}
			return 'now';
		}
		return 'now';
	}, [plan.transportationMode, beforeAfterRepresentativeType, plan.placeEndTime]);

	/** **********************************************************************************************
	 * Google Map Directions を用いて予定間の移動時間を計算する
	 *********************************************************************************************** */
	const calculateDirection = useCallback(async () => {
		if (!plan.transportationMode || !nextPlan || !plan.place_id || !nextPlan.place_id) {
			return;
		}
		const directionsResponse = await PlaceHttpPost<
			Omit<DirectionsRequest['params'], 'key'>,
			Pick<DirectionsResponse, 'status' | 'data'>
		>('PBL003', {
			origin: `place_id:${plan.place_id}`,
			destination: `place_id:${nextPlan.place_id}`,
			mode: plan.transportationMode,
			waypoints: [],
			alternatives: false,
			avoid: plan.avoid,
			language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
			units: undefined,
			region: undefined,
			arrival_time,
			departure_time,
			traffic_model: TrafficModel.best_guess,
			transit_mode: plan.transitModes,
			transit_routing_preference: plan.transitRoutingPreference,
			optimize: false,
		});
		Logger('IMC03102TrafficMovementEdit', 'directionsService.route.result', planID);
		if (directionsResponse.status === 200 && directionsResponse.data.status === 'OK') {
			/** **********************************************************************************************
			 * transportationSpan をレスポンスから設定する
			 * before の場合 transportationArrivalTime に次の予定の placeStartTime を設定し、
			 * *	transportationDepartureTime を transportationArrivalTime - transportationSpan で計算する
			 * after の場合 transportationDepartureTime に自分の予定の placeEndTime を設定し、
			 * *	transportationArrivalTime を transportationDepartureTime + transportationSpan で計算する
			 *********************************************************************************************** */
			if (plan.transportationMode) {
				const transportationSpan: PlansMapInterface['transportationSpan'] = plan.placeSpan;
				transportationSpan.setDate(1);
				transportationSpan.setHours(0);
				transportationSpan.setMinutes(0);
				transportationSpan.setSeconds(directionsResponse.data.routes[0].legs[0].duration?.value || 0);
				const val: Pick<PlansMapInterface, 'transportationDepartureTime' | 'transportationArrivalTime'> = (() => {
					if (beforeAfterRepresentativeType === 'before') {
						return {
							transportationArrivalTime: dependentPlan.placeStartTime,
							transportationDepartureTime: DateUtils.subtraction(dependentPlan.placeStartTime, transportationSpan, [
								'Hours',
								'Minutes',
								'Seconds',
							]),
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
		} else {
			/* ERROR の場合は、TravelMode を undefined に変更する */
			await setDoc(planDocSnap.ref, {
				...planDocSnap.data(),
				transportationMode: undefined,
			});
		}
	}, [
		plan.place_id,
		planID,
		nextPlan,
		plan.avoid,
		plan.transportationMode,
		plan.placeEndTime,
		dependentPlan,
		arrival_time,
		departure_time,
		beforeAfterRepresentativeType,
		plan.placeSpan,
		planDocSnap,
		plan.transitModes,
		plan.transitRoutingPreference,
	]);

	const clearTransportationTime = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap.ref, {
			...plan,
			transportationSpan: DateUtils.initialDate(),
			transportationArrivalTime: undefined,
			transportationDepartureTime: undefined,
		});
	}, [plan, planDocSnap.ref]);

	// transportationMode, transitModes, transitRoutingPreference, avoid を監視し、予定間の移動時間を再計算する
	// transportationMode が undefined であれば、予定間の移動時間を初期化する
	useEffect(() => {
		if (isPlanGroupMounted && plan.transportationMode) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			calculateDirection();
		} else if (isPlanGroupMounted && !plan.transportationMode) {
			clearTransportationTime();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plan.transportationMode, plan.transitModes.toString(), plan.transitRoutingPreference, plan.avoid.toString()]);

	// 自分の予定の place_id を監視し、予定間の移動時間を再計算する
	// place_id が undefined であれば、予定間の移動時間を初期化する
	useEffect(() => {
		if (isPlanGroupMounted && plan.place_id) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			calculateDirection();
		} else if (isPlanGroupMounted && !plan.place_id) {
			clearTransportationTime();
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
			clearTransportationTime();
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
			avoid: plan.avoid,
			transitModes: plan.transitModes,
			transitRoutingPreference: plan.transitRoutingPreference,
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
		plan.avoid,
		plan.transitModes,
		plan.transitRoutingPreference,
		planGroupsDoc.ref,
	]);

	return { addPlan, bottomSheetVisible, setBottomSheetVisible };
};
