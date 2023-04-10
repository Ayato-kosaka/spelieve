import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { setDoc } from 'firebase/firestore';
import { useContext, useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { TextInputChangeEventData } from 'react-native';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';
import { PlansMapInterface } from '@/Itinerary/Contexts/ICT031PlansMap/PlansMapInterface';
import { PCT012MPlaceOne } from '@/Place/Contexts/PCT012MPlaceOne';

export const IPA003EditPlanController = ({ route, navigation }: ItineraryStackScreenProps<'EditPlan'>) => {
	const { itineraryID, planGroupID, planID } = route.params;
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const planGroupDocSnap = useMemo(
		() => planGroupsQSnap?.docs.find((doc) => doc.id === planGroupID),
		[planGroupID, planGroupsQSnap],
	);
	const planGroup = useMemo(() => planGroupDocSnap?.data(), [planGroupDocSnap]);

	const planDocSnap = useMemo(() => (planID ? plansDocSnapMap[planID] : undefined), [planID, plansDocSnapMap]);
	const plan = useMemo(() => (planDocSnap ? planDocSnap.data() : undefined), [planDocSnap]);

	const { setPlaceID, place } = useContext(PCT012MPlaceOne);
	const prevPlaceRef = useRef<typeof place>(undefined);

	const [pagePlan, setPagePlan] = useState<PlansMapInterface | undefined>(undefined);

	// アンマウント時に、PlaceID を undefined で初期化する
	useEffect(
		() => () => {
			setPlaceID(undefined);
		},
		[setPlaceID],
	);

	// Header にタイトルを設定する
	useEffect(() => {
		navigation.setOptions({
			title: plan?.title,
		});
	}, [navigation, plan?.title]);

	const navigateToItineraryEdit = useCallback(() => {
		navigation.navigate('ItineraryTopTabNavigator', {
			screen: 'ItineraryEdit',
			params: {
				itineraryID,
			},
		});
	}, [navigation, itineraryID]);

	// パラメータを監視し、不足があれば navigateToItineraryEdit する
	useEffect(() => {
		if (itineraryID === undefined || planGroupID === undefined || planID === undefined) {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/397 HelloSpelieve に遷移できない
			navigation.navigate('HelloSpelieve', {});
		}
	}, [planGroupID, itineraryID, navigateToItineraryEdit, navigation, planID, setItineraryID]);

	// plan.place_id を監視し、 Place Context にセットする
	useEffect(() => {
		setPlaceID(plan?.place_id);
	}, [plan?.place_id, setPlaceID]);

	// Context の plan を監視し、 pagePlan にセットする
	useEffect(() => {
		if (plan) {
			setPagePlan({ ...plan });
		}
	}, [plan]);

	const isRepresentativePlan: boolean = useMemo(
		() => planGroup?.representativePlanID === planDocSnap?.id,
		[planGroup?.representativePlanID, planDocSnap],
	);

	const isNeedToShowActivityIndicator = useMemo(
		() => !itineraryDocSnap || isPlansLoading || !planGroupsQSnap || !planGroupDocSnap || !planGroup || !pagePlan,
		[itineraryDocSnap, isPlansLoading, planGroupsQSnap, planGroupDocSnap, planGroup, pagePlan],
	);

	// place.name を監視し、plan.title を更新する
	useEffect(() => {
		if (!!place && place.name !== plan?.title && planDocSnap && (!plan?.title || prevPlaceRef.current)) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap.ref, { title: place.name }, { merge: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place?.name]);

	// place.imageUrl を監視し、plan.imageUrl を更新する
	useEffect(() => {
		if (!!place && place.imageUrl !== plan?.imageUrl && planDocSnap && (!plan?.imageUrl || prevPlaceRef.current)) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap.ref, { imageUrl: place.imageUrl }, { merge: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place?.imageUrl]);

	const isNeedToNavigateToItineraryEdit = useMemo(
		() => !isNeedToShowActivityIndicator && !itineraryDocSnap!.exists(),
		[isNeedToShowActivityIndicator, itineraryDocSnap],
	);

	const updatePlan = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap!.ref, { ...pagePlan });
	}, [pagePlan, planDocSnap]);

	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const onPressThumbnail = useCallback(() => {
		if (!pagePlan) {
			return;
		}
		setThumbnailItemMapper({
			aspectRatio: 16 / 9,
			textMap: pagePlan.textMap,
			storeUrlMap: pagePlan.storeUrlMap,
			onBack(thumbnailID, thumbnailItemMapper, imageUrl) {
				if (planDocSnap) {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					setDoc<PlansMapInterface>(
						planDocSnap.ref,
						{
							thumbnailID,
							imageUrl,
							textMap: thumbnailItemMapper.textMap,
							storeUrlMap: thumbnailItemMapper.storeUrlMap,
						},
						{ merge: true },
					);
				}
			},
		});
		navigation.navigate('ThumbnailPageNavigator', {
			screen: 'TPA001ThumbnailEditor',
			params: {
				fromThumbnailID: pagePlan?.thumbnailID,
			},
		});
	}, [navigation, pagePlan, planDocSnap, setThumbnailItemMapper]);

	const onChangeMemo: ({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => void = useCallback(
		({ nativeEvent }) => {
			setPagePlan({ ...pagePlan!, memo: nativeEvent.text });
		},
		[pagePlan],
	);

	const onAutocompleteClicked = useCallback(
		(data: PlaceAutocompleteResult): void => {
			if (!planDocSnap) {
				return;
			}
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(
				planDocSnap.ref,
				{ place_id: data.place_id, title: data.structured_formatting.main_text },
				{ merge: true },
			);
		},
		[planDocSnap],
	);

	const setPlanToRepresentativePlan = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(
			planGroupDocSnap!.ref,
			{ representativePlanID: planDocSnap?.id, representativeStartDateTime: plan?.placeStartTime },
			{ merge: true },
		);
	}, [planGroupDocSnap, planDocSnap, plan?.placeStartTime]);

	const updateRepresentativeStartDateTime: (event: DateTimePickerEvent, date?: Date | undefined) => void = useCallback(
		(event, date) => {
			if (event.type === 'set' && planGroupDocSnap) {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				setDoc(
					planGroupDocSnap.ref,
					{
						representativeStartDateTime: date,
					},
					{ merge: true },
				);
			}
		},
		[planGroupDocSnap],
	);

	// prevPlace を更新する
	useEffect(() => {
		if (place !== undefined) {
			prevPlaceRef.current = place;
		}
	}, [place]);

	return {
		planGroup,
		planDocSnap,
		pagePlan: pagePlan!,
		isRepresentativePlan,
		isNeedToShowActivityIndicator,
		isNeedToNavigateToItineraryEdit,
		navigateToItineraryEdit,
		updatePlan,
		onPressThumbnail,
		updateRepresentativeStartDateTime,
		setPlanToRepresentativePlan,
		onAutocompleteClicked,
		onChangeMemo,
	};
};
