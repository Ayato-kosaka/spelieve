import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setDoc } from 'firebase/firestore';
import { useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { GooglePlaceData } from 'react-native-google-places-autocomplete';

import { EditPlanControllerInterface } from 'spelieve-common/lib/Interfaces';
import { PlansMapInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT031';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne';

export const IPA003EditPlanController = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA003EditPlan'>): EditPlanControllerInterface => {
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

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/342 IPA003PlanEdit コンソールエラー解消

	// パラメータの itineraryID を監視しし、 Itinerary Context にセットする
	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

	// plan.place_id を監視し、 Place Context にセットする
	useEffect(() => {
		if (plan?.place_id) {
			setPlaceID(plan?.place_id);
		}
	}, [plan?.place_id, setPlaceID]);

	// place.name を監視し、plan.title を更新する
	useEffect(() => {
		if (!!place && place.name !== plan?.title && planDocSnap) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap?.ref, { title: place.name }, { merge: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [place?.name]);

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
		() => !itineraryDocSnap || isPlansLoading || !planGroupsQSnap || !planGroupDocSnap || !planGroup,
		[itineraryDocSnap, isPlansLoading, planGroupsQSnap, planGroupDocSnap, planGroup],
	);

	const isNeedToNavigateToItineraryEdit = useMemo(
		() => !isNeedToShowActivityIndicator && (!itineraryDocSnap!.exists() || !pagePlan),
		[isNeedToShowActivityIndicator, itineraryDocSnap, pagePlan],
	);

	const updatePlan = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap!.ref, { ...pagePlan });
	}, [pagePlan, planDocSnap]);

	const navigateToItineraryEdit = useCallback(() => {
		navigation.navigate('Itinerary', {
			screen: 'IPA001ItineraryEdit',
			params: {
				itineraryID,
			},
		});
	}, [navigation, itineraryID]);

	const onChangeSearchPlace: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void = (e) => {
		setPagePlan({ ...pagePlan!, title: e.nativeEvent.text });
	};

	const onChangeMemo: EditPlanControllerInterface['onChangeMemo'] = useCallback(
		({ nativeEvent }) => {
			setPagePlan({ ...pagePlan!, memo: nativeEvent.text });
		},
		[pagePlan],
	);

	const onAutoCompleteClicked = useCallback(
		(data: GooglePlaceData): void => {
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

	const updateRepresentativeStartDateTime: EditPlanControllerInterface['updateRepresentativeStartDateTime'] =
		useCallback(
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
		updateRepresentativeStartDateTime,
		setPlanToRepresentativePlan,
		onChangeSearchPlace,
		onAutoCompleteClicked,
		onChangeMemo,
	};
};
