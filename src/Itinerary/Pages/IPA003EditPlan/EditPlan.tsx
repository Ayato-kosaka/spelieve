import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setDoc } from 'firebase/firestore';
import { useContext, useMemo } from 'react';
import { ActivityIndicator, Button, FlatList, Image, ScrollView, View } from 'react-native';
import { Chip, Divider, Searchbar, Text, TextInput } from 'react-native-paper';

import { IPA003EditPlanController } from './EditPlanController';

import { BottomTabParamList } from '@/App';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO004DurationPicker } from '@/Common/Components/CCO004DurationPicker';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PMC01202PlaceInformation } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';

export const IPA003EditPlan = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'IPA003EditPlan'>) => {
	const { PlanGroupsIndex, planID } = route.params;

	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const planGroupDocSnap = useMemo(
		() => (PlanGroupsIndex != null ? planGroupsQSnap?.docs[PlanGroupsIndex] : undefined),
		[PlanGroupsIndex, planGroupsQSnap],
	);
	const planGroup = useMemo(() => planGroupDocSnap?.data(), [planGroupDocSnap]);

	const planDocSnap = useMemo(() => (planID ? plansDocSnapMap[planID] : undefined), [planID, plansDocSnapMap]);

	const {
		pagePlan,
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
	} = IPA003EditPlanController({ route, navigation });

	if (isNeedToShowActivityIndicator) {
		return <ActivityIndicator animating />;
	}

	if (isNeedToNavigateToItineraryEdit) {
		navigateToItineraryEdit();
		return <ActivityIndicator animating />;
	}

	return (
		<ScrollView>
			<Image source={{ uri: pagePlan.imageUrl }} />
			<PCO001SearchPlace
				onAutoCompleteClicked={onAutoCompleteClicked}
				hideCities
				fetchDetails={false}
				value={pagePlan.title}
				onChange={onChangeSearchPlace}
			/>
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

			{isRepresentativePlan ? (
				<View>
					<Text>{i18n.t('代表プランの開始時間')}</Text>
					<CCO003DateTimePicker
						value={planGroup!.representativeStartDateTime}
						onChange={updateRepresentativeStartDateTime}
						mode="date"
					/>
					<CCO003DateTimePicker
						value={planGroup!.representativeStartDateTime}
						onChange={updateRepresentativeStartDateTime}
						mode="time"
					/>
				</View>
			) : (
				<Button title={i18n.t('この予定を基準の予定にする')} onPress={setPlanToRepresentativePlan} />
			)}
			<PMC01202PlaceInformation />
		</ScrollView>
	);
};
