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

export const IPA003EditPlan = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'IPA003EditPlan'>) => {
	const { itineraryID, PlanGroupsIndex, planID } = route.params;

	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading, plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, planGroupsCRef } = useContext(ICT021PlanGroupsList);
	const planDocSnap = useMemo(() => (planID ? plansDocSnapMap[planID] : undefined), [planID, plansDocSnapMap]);
	const plan = useMemo(() => (planDocSnap ? planDocSnap.data() : undefined), [planDocSnap]);

	// TODO: Conroller に移動する

	const [pagePlan, setPagePlan] = useState<PlansMapInterface | undefined>(undefined);

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

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
		// TODO エラーを解消する
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

	if (!itineraryDocSnap || isPlansLoading || !planGroupsQSnap) {
		return <ActivityIndicator animating />;
	}

	if (!itineraryDocSnap.exists() || !pagePlan) {
		navigate();
		return <ActivityIndicator animating />;
	}

	// TODO: Console エラーが出ている

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
			{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/336 span 用コンポーネントを作成する */}
			<View>
				<Text>{i18n.t('滞在時間')}</Text>
				<CCO003DateTimePicker value={pagePlan.placeSpan} />
				<CCO004DurationPicker
					value={pagePlan.placeSpan}
					onBlur={(newVal) => setDoc(planDocSnap!.ref, { placeSpan: newVal }, { merge: true })}
				/>
			</View>
			{/* TODO: PPA002 がマージされたら取り込む。 <PMC01202PlaceInformation /> */}
		</View>
	);
};
