import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { doc, DocumentSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { TextInputChangeEventData } from 'react-native';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT011/ItineraryOneInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { consoleError } from '@/Common/Hooks/CHK001Utils';
import { RootStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOneController } from '@/Itinerary/Contexts/ICT011ItineraryOne/ItineraryOneController';
import { ICT021PlanGroupsListController } from '@/Itinerary/Contexts/ICT021PlanGroupsList/PlanGroupsListController';
import { PlanGroupsListInterface } from '@/Itinerary/Contexts/ICT021PlanGroupsList/PlanGroupsListInterface';
import { ICT031PlansMapController } from '@/Itinerary/Contexts/ICT031PlansMap/PlansMapController';
import { PlansMapInterface } from '@/Itinerary/Contexts/ICT031PlansMap/PlansMapInterface';
import { PCT012MPlaceOne } from '@/Place/Contexts/PCT012MPlaceOne';

export const IPA003EditPlanController = ({ route, navigation }: RootStackScreenProps<'EditPlan'>) => {
	const { setPlaceID, place } = useContext(PCT012MPlaceOne);

	const { itineraryID, planGroupID, planID } = useMemo(() => {
		if (
			route.params.itineraryID === undefined ||
			route.params.planGroupID === undefined ||
			route.params.planID === undefined
		) {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/397 HelloSpelieve に遷移できない(エラーとなる)
			navigation.navigate('BottomTabNavigator', {
				screen: 'Itinerary',
				params: { screen: 'HelloSpelieve', params: {} },
			});
			throw new Error();
		}
		return {
			itineraryID: route.params.itineraryID,
			planGroupID: route.params.planGroupID,
			planID: route.params.planID,
		};
	}, [navigation, route.params]);

	// itinerayDocumentSnapshot の取得処理
	const { itineraryCRef } = ICT011ItineraryOneController();
	const itineraryDocumentReference = useMemo(() => doc(itineraryCRef, itineraryID), [itineraryCRef, itineraryID]);
	const [itineraryDocSnap, setItineraryDocSnap] = useState<DocumentSnapshot<ItineraryOneInterface> | undefined>(
		undefined,
	);
	useEffect(() => {
		getDoc(itineraryDocumentReference)
			.then((documentSnapshot) => {
				setItineraryDocSnap(documentSnapshot);
			})
			.catch((e) => consoleError('IPA003EditPlanController', 'getDoc(itineraryDocumentReference)', e));
	}, [itineraryDocumentReference]);

	// planGroup の取得処理
	const { planGroupsCRef } = ICT021PlanGroupsListController(itineraryDocSnap);
	const planGroupDocumentReference = useMemo(
		() => (planGroupsCRef ? doc(planGroupsCRef, planGroupID) : undefined),
		[planGroupsCRef, planGroupID],
	);
	const [planGroup, setPlanGroup] = useState<PlanGroupsListInterface | undefined>(undefined);
	useEffect(() => {
		if (planGroupDocumentReference)
			getDoc(planGroupDocumentReference)
				.then((documentSnapshot) => {
					setPlanGroup(documentSnapshot.data());
				})
				.catch((e) => consoleError('IPA003EditPlanController', 'getDoc(planGroupDocumentReference)', e));
	}, [planGroupDocumentReference]);

	// plan の取得処理
	const { getPlansCRef } = ICT031PlansMapController();
	const plansCRef = useMemo(() => getPlansCRef(itineraryDocumentReference), [getPlansCRef, itineraryDocumentReference]);
	const plansDocumentReference = useMemo(() => doc(plansCRef, planID), [planID, plansCRef]);
	const [plan, setPlan] = useState<PlansMapInterface | undefined>(undefined);
	useEffect(() => {
		getDoc(plansDocumentReference)
			.then((documentSnapshot) => {
				const data = documentSnapshot.data();
				setPlan(data);
				setPlaceID(data?.place_id);
				navigation.setOptions({
					title: data?.title,
				});
			})
			.catch((e) => consoleError('IPA003EditPlanController', 'getDoc(planDocumentReference)', e));
	}, [plansDocumentReference, setPlaceID, navigation]);

	const isRepresentativePlan: boolean = useMemo(
		() => planGroup?.representativePlanID === planID,
		[planGroup?.representativePlanID, planID],
	);

	// 本画面では、画面を出る時に画面の内容をDBに保存する整理とする。
	// 後勝ちとなるため注意する、
	// 画面操作中に plan が更新された場合上書きしてしまうが、そのようなことは起きない想定。
	const beforeRemove = useCallback(() => {
		setDoc(plansDocumentReference, { ...plan }).catch((e) => consoleError('IPA003EditPlanController', 'onRemove', e));
		if (planGroupDocumentReference)
			setDoc(
				planGroupDocumentReference,
				{
					representativePlanID: isRepresentativePlan ? planID : undefined,
					representativeStartDateTime: planGroup?.representativeStartDateTime,
				},
				{ merge: true },
			).catch((e) => consoleError('IPA003EditPlanController', 'updateRepresentativeStartDateTime', e));
	}, [
		isRepresentativePlan,
		plan,
		planGroup?.representativeStartDateTime,
		planGroupDocumentReference,
		planID,
		plansDocumentReference,
	]);
	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', beforeRemove);
		return unsubscribe;
	}, [beforeRemove, navigation]);

	// place.place_id を監視し、place が plan が持っているものから更新された場合、
	// title, imageUrl を更新する
	useEffect(() => {
		if (place && place.place_id !== plan?.place_id) {
			setPlan((v) => v && { ...v, place_id: place.place_id, title: place.name, imageUrl: place.imageUrl });
			navigation.setOptions({
				title: place.name,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place?.place_id]);

	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const onPressThumbnail = useCallback(() => {
		if (plan === undefined) {
			return;
		}
		setThumbnailItemMapper({
			aspectRatio: 16 / 9,
			textMap: plan.textMap,
			storeUrlMap: plan.storeUrlMap,
			onBack(thumbnailID, thumbnailItemMapper, imageUrl) {
				setPlan(
					(v) =>
						v && {
							...v,
							thumbnailID,
							imageUrl,
							textMap: thumbnailItemMapper.textMap,
							storeUrlMap: thumbnailItemMapper.storeUrlMap,
						},
				);
			},
		});
		navigation.push('ThumbnailPageNavigator', {
			screen: 'TPA001ThumbnailEditor',
			params: {
				fromThumbnailID: plan?.thumbnailID,
			},
		});
	}, [navigation, plan, setThumbnailItemMapper]);

	const onAutocompleteClicked = useCallback(
		(data: PlaceAutocompleteResult): void => {
			setPlaceID(data.place_id);
		},
		[setPlaceID],
	);

	const onChangeMemo: ({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => void = useCallback(
		({ nativeEvent }) => {
			setPlan((v) => v && { ...v, memo: nativeEvent.text });
		},
		[],
	);

	const onBlurSpan = useCallback((val: Date) => {
		setPlan((v) => v && { ...v, placeSpan: val });
	}, []);

	const updateRepresentativeStartDateTime: (event: DateTimePickerEvent, date?: Date | undefined) => void = useCallback(
		(event, date) => {
			if (event.type === 'set' && date && planGroupDocumentReference) {
				setPlanGroup((v) => v && { ...v, representativeStartDateTime: date });
			}
		},
		[planGroupDocumentReference],
	);

	const setPlanToRepresentativePlan = useCallback(() => {
		if (planGroupDocumentReference && plan?.placeStartTime) {
			setPlanGroup(
				(v) => v && { ...v, representativePlanID: planID, representativeStartDateTime: plan.placeStartTime },
			);
		}
	}, [plan?.placeStartTime, planGroupDocumentReference, planID]);

	return {
		planGroup,
		isRepresentativePlan,
		plan,
		onPressThumbnail,
		updateRepresentativeStartDateTime,
		setPlanToRepresentativePlan,
		onAutocompleteClicked,
		onChangeMemo,
		onBlurSpan,
	};
};
