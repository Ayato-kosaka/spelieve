import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setDoc } from 'firebase/firestore';
import { useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

import { PlansMapInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT031';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne';

export const IPA003EditPlanController = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA003EditPlan'>) => {
	const { itineraryID, PlanGroupsIndex, planID } = route.params;

	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const planGroupDocSnap = useMemo(
		() => (PlanGroupsIndex != null ? planGroupsQSnap?.docs[PlanGroupsIndex] : undefined),
		[PlanGroupsIndex, planGroupsQSnap],
	);
	const planGroup = useMemo(() => planGroupDocSnap?.data(), [planGroupDocSnap]);

	const planDocSnap = useMemo(() => (planID ? plansDocSnapMap[planID] : undefined), [planID, plansDocSnapMap]);
	const plan = useMemo(() => (planDocSnap ? planDocSnap.data() : undefined), [planDocSnap]);

	const { setPlaceID, place } = useContext(PCT012MPlaceOne);

	const [pagePlan, setPagePlan] = useState<PlansMapInterface | undefined>(undefined);

	const navigateToItineraryEdit = useCallback(() => {
		navigation.navigate('Itinerary', {
			screen: 'IPA001ItineraryEdit',
			params: {
				itineraryID,
			},
		});
	}, [navigation, itineraryID]);

	// パラメータを監視し、不足があれば navigateToItineraryEdit する
	useEffect(() => {
		if (itineraryID === undefined || PlanGroupsIndex === undefined || planID === undefined) {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/397 HelloSpelieve に遷移できない
			navigation.navigate('Itinerary', {
				screen: 'HelloSpelieve',
				params: {},
			});
		}
	}, [PlanGroupsIndex, itineraryID, navigateToItineraryEdit, navigation, planID, setItineraryID]);

	// plan.place_id を監視し、 Place Context にセットする
	useEffect(() => {
		setPlaceID(plan?.place_id);
	}, [plan?.place_id, setPlaceID]);

	// place.name を監視し、plan.title を更新する
	useEffect(() => {
		if (!!place && place.name !== plan?.title && planDocSnap) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap?.ref, { title: place.name }, { merge: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place?.name]);

	// place.imageUrl を監視し、plan.imageUrl を更新する
	useEffect(() => {
		if (!!place && place.imageUrl !== plan?.imageUrl && planDocSnap) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap?.ref, { imageUrl: place.imageUrl }, { merge: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place?.imageUrl]);

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

	const isNeedToNavigateToItineraryEdit = useMemo(
		() => !isNeedToShowActivityIndicator && !itineraryDocSnap!.exists(),
		[isNeedToShowActivityIndicator, itineraryDocSnap],
	);

	const updatePlan = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap!.ref, { ...pagePlan });
	}, [pagePlan, planDocSnap]);

	const onChangeImage = useCallback(
		(imageUrl: string) => {
			setPagePlan({ ...pagePlan!, imageUrl });
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap!.ref, { imageUrl }, { merge: true });
		},
		[pagePlan, planDocSnap],
	);

	const onChangeSearchPlace: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void = (e) => {
		setPagePlan({ ...pagePlan!, title: e.nativeEvent.text });
	};

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

	const deleteTag = useCallback(
		(index: number): void => {
			const newTags: string[] = plan!.tags.splice(index, 1);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap!.ref, { tags: newTags }, { merge: true });
		},
		[plan, planDocSnap],
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

	return {
		pagePlan: pagePlan!,
		isRepresentativePlan,
		isNeedToShowActivityIndicator,
		isNeedToNavigateToItineraryEdit,
		navigateToItineraryEdit,
		updatePlan,
		deleteTag,
		onChangeImage,
		updateRepresentativeStartDateTime,
		setPlanToRepresentativePlan,
		onChangeSearchPlace,
		onAutocompleteClicked,
		onChangeMemo,
	};
};
