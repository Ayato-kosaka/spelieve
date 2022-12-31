import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MediaTypeOptions } from 'expo-image-picker';
import { setDoc } from 'firebase/firestore';
import { useContext, useMemo } from 'react';
import { ActivityIndicator, Button, Image, ScrollView, View } from 'react-native';
import { Chip, Divider, Searchbar, Text, TextInput } from 'react-native-paper';

import { IPA003EditPlanController } from './EditPlanController';

import { BottomTabParamList } from '@/App';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO004DurationPicker } from '@/Common/Components/CCO004DurationPicker';
import { CCO006ImagePicker } from '@/Common/Components/CCO006ImagePicker/ImagePicker';
import i18n from '@/Common/Hooks/i18n-js';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';
import { PCO002GooglePlacesAutocomplete } from '@/Place/Components/PCO002GooglePlacesAutocomplete';
import { PMC01202PlaceInformation } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';
import { materialColors } from '@/ThemeProvider';

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
		tagSearchText,
		onTagSearchTextChanged,
		onTagSearchTextBlur,
		deleteTag,
		onChangeImage,
		updateRepresentativeStartDateTime,
		setPlanToRepresentativePlan,
		onChangeSearchPlace,
		onAutocompleteClicked,
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
			<CCO006ImagePicker
				onPickImage={onChangeImage}
				imagePickerOptions={{
					allowsEditing: true,
					allowsMultipleSelection: false,
					mediaTypes: MediaTypeOptions.Images,
					aspect: [1, 1],
					quality: 1,
				}}
				imageManipulatorActions={[
					{
						resize: {
							width: 2000,
						},
					},
				]}
				storage={storage}>
				<Image
					source={{ uri: pagePlan.imageUrl }}
					resizeMode="cover"
					style={{
						paddingTop: '56.25%',
						backgroundColor: materialColors.grey[300],
						height: 150,
					}}
				/>
			</CCO006ImagePicker>
			<PCO002GooglePlacesAutocomplete
				onAutocompleteClicked={onAutocompleteClicked}
				onlySpot
				fetchDetails={false}
				placeholder={i18n.t('場所を検索する')}
			/>
			<Divider style={{ marginVertical: 20 }} />
			<TextInput label={i18n.t('メモ')} value={pagePlan.memo} onChange={onChangeMemo} onBlur={updatePlan} multiline />
			<ScrollView horizontal style={{ flexDirection: 'row' }}>
				{pagePlan.tags.map((tag, index) => (
					<Chip key={`${tag}${index.toString()}`} closeIcon="close-circle" onClose={() => deleteTag(index)}>
						{tag}
					</Chip>
				))}
				{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/298 Tagを取得するSearchBarを実装する */}
				<Searchbar
					placeholder={i18n.t('タグを追加する')}
					value={tagSearchText}
					onChange={onTagSearchTextChanged}
					onBlur={onTagSearchTextBlur}
				/>
			</ScrollView>
			<View>
				<Text>{i18n.t('滞在時間')}</Text>
				<CCO004DurationPicker
					value={pagePlan.placeSpan}
					onBlur={(newVal) => setDoc(planDocSnap!.ref, { placeSpan: newVal }, { merge: true })}
				/>
			</View>

			{isRepresentativePlan ? (
				<View
					style={{
						// @react-native-community/datetimepicker が隠れるため、z-index: 1 を設定する
						zIndex: 1,
					}}>
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
