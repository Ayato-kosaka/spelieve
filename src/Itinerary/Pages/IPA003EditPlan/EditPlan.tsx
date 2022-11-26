import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setDoc } from 'firebase/firestore';
import { useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TextInputChangeEventData, View } from 'react-native';
import { GooglePlaceData } from 'react-native-google-places-autocomplete';
import { Chip, Divider, Searchbar, Text, TextInput } from 'react-native-paper';

import { PlansMapInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT031';

import { BottomTabParamList } from '@/App';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO004DurationPicker } from '@/Common/Components/CCO004DurationPicker';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne';
import { PMC01202PlaceInformation } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';

export const IPA003EditPlan = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'IPA003EditPlan'>) => {
	const { itineraryID, PlanGroupsIndex, planID } = route.params;

	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, planGroupsCRef } = useContext(ICT021PlanGroupsList);
	const planGroupDocSnap = useMemo(
		() => (PlanGroupsIndex != null ? planGroupsQSnap?.docs[PlanGroupsIndex] : undefined),
		[PlanGroupsIndex, planGroupsQSnap],
	);
	const planGroup = useMemo(() => planGroupDocSnap?.data(), [planGroupDocSnap]);
	const planDocSnap = useMemo(() => (planID ? plansDocSnapMap[planID] : undefined), [planID, plansDocSnapMap]);
	const plan = useMemo(() => (planDocSnap ? planDocSnap.data() : undefined), [planDocSnap]);

	const { setPlaceID } = useContext(PCT012MPlaceOne);

	// TODO: Conroller に移動する

	const [pagePlan, setPagePlan] = useState<PlansMapInterface | undefined>(undefined);

	// パラメータの itineraryID を監視しし、 Itinerary Context にセットする
	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

	// Context の plan.place_id を監視し、 Place Context にセットする
	useEffect(() => {
		if (plan?.place_id) {
			setPlaceID(plan?.place_id);
		}
	}, [plan?.place_id, setPlaceID]);

	// Context の plan を監視し、 pagePlan にセットする
	useEffect(() => {
		if (plan) {
			setPagePlan({ ...plan });
		}
	}, [plan]);

	const updatePlan = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(planDocSnap!.ref, { ...pagePlan });
	}, [pagePlan, planDocSnap]);

	const navigate = useCallback(() => {
		// TODO: https://github.com/Ayato-kosaka/spelieve/issues/342 IPA003PlanEdit コンソールエラー解消
		navigation.navigate('Itinerary', {
			screen: 'IPA001ItineraryEdit',
			params: {
				itineraryID,
			},
		});
	}, [navigation, itineraryID]);

	const onChangeMemo = useCallback(
		({ nativeEvent }: { nativeEvent: TextInputChangeEventData }): void => {
			setPagePlan({ ...pagePlan!, memo: nativeEvent.text });
		},
		[pagePlan],
	);

	const onAutoCompleteClicked = useCallback((data: GooglePlaceData) => {}, []);

	const deleteTag = useCallback(
		(index: number): void => {
			const newTags: string[] = plan!.tags.splice(index, 1);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc(planDocSnap!.ref, { tags: newTags }, { merge: true });
		},
		[plan, planDocSnap],
	);

	if (!itineraryDocSnap || isPlansLoading || !planGroupsQSnap || !planGroupDocSnap || !planGroup) {
		return <ActivityIndicator animating />;
	}

	if (!itineraryDocSnap.exists() || !pagePlan) {
		navigate();
		return <ActivityIndicator animating />;
	}

	return (
		<View>
			<Image source={{ uri: pagePlan.imageUrl }} />
			<PCO001SearchPlace onAutoCompleteClicked={(data) => console.log(data.place_id)} hideCities />
			<Divider style={{ marginVertical: 20 }} />
			<TextInput label={i18n.t('メモ')} value={pagePlan.memo} onChange={onChangeMemo} onBlur={updatePlan} multiline />
			<FlatList
				data={pagePlan.tags}
				horizontal
				renderItem={(renderItemInfo) => (
					<Chip closeIcon="close-circle" onClose={() => deleteTag(renderItemInfo.index)}>
						{renderItemInfo.item}
					</Chip>
				)}
				ListFooterComponent={
					/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/298 Tagを取得するSearchBarを実装する */
					<Searchbar placeholder="Search" value="" />
				}
			/>
			<View>
				<Text>{i18n.t('滞在時間')}</Text>
				<CCO004DurationPicker
					value={pagePlan.placeSpan}
					onBlur={(newVal) => setDoc(planDocSnap!.ref, { placeSpan: newVal }, { merge: true })}
				/>
			</View>

			<View>
				<Text>{i18n.t('代表プランの開始時間')}</Text>
				<CCO003DateTimePicker
					value={planGroup.representativeStartDateTime}
					// TODO: Controller に切り出す
					onChange={(event, date) => {
						if (event.type === 'set') {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							setDoc(
								planGroupDocSnap.ref,
								{
									representativeStartDateTime: date!,
								},
								{ merge: true },
							);
						}
					}}
					mode="time"
				/>
			</View>
			<PMC01202PlaceInformation />
		</View>
	);
};
