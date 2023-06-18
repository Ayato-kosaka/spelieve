import { setDoc } from 'firebase/firestore';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { IPA003EditPlanController } from './EditPlanController';
import { styles } from './EditPlanStyle';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO004DurationPicker } from '@/Common/Components/CCO004DurationPicker';
import { CCO007GoogleBannerAd } from '@/Common/Components/CCO007GoogleBannerAd/GoogleBannerAd';
import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { PCO002GooglePlacesAutocomplete } from '@/Place/Components/PCO002GooglePlacesAutocomplete';
import { PMC01202PlaceInformation } from '@/Place/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';

export const IPA003EditPlan = ({ route, navigation }: ItineraryStackScreenProps<'EditPlan'>) => {
	const {
		planGroup,
		planDocSnap,
		pagePlan,
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
			<CCO007GoogleBannerAd />
			<Pressable onPress={onPressThumbnail}>
				<MaterialCommunityIcons
					name="camera-outline"
					size={100}
					color="rgba(0,0,0,0.5)"
					style={styles.materialCommunityIcons}
				/>
				<Image source={{ uri: pagePlan.imageUrl }} resizeMode="cover" style={styles.image} />
			</Pressable>
			<PCO002GooglePlacesAutocomplete
				onAutocompleteClicked={onAutocompleteClicked}
				onlySpot
				fetchDetails={false}
				placeholder={i18n.t('Search Place')}
			/>
			<TextInput
				label={i18n.t('Memo')}
				value={pagePlan.memo}
				onChange={onChangeMemo}
				onBlur={updatePlan}
				style={styles.memoTextInput}
			/>
			<CCO004DurationPicker
				value={pagePlan.placeSpan}
				label={i18n.t('Stay time')}
				onBlur={(newVal) => setDoc(planDocSnap!.ref, { placeSpan: newVal }, { merge: true })}
				style={styles.spanTextInput}
			/>

			{isRepresentativePlan ? (
				<View
					style={{
						// @react-native-community/datetimepicker が隠れるため、z-index: 1 を設定する
						zIndex: 1,
					}}>
					<Text style={styles.representativeStartDateTimeLabel}>{i18n.t('Representative plan Start date')}</Text>
					<View style={{ flexDirection: 'row' }}>
						<CCO003DateTimePicker
							style={styles.representativeStartDateTimePicker}
							value={planGroup!.representativeStartDateTime}
							onChange={updateRepresentativeStartDateTime}
							mode="date"
						/>
						<CCO003DateTimePicker
							style={styles.representativeStartDateTimePicker}
							value={planGroup!.representativeStartDateTime}
							onChange={updateRepresentativeStartDateTime}
							mode="time"
						/>
					</View>
				</View>
			) : (
				<Button mode="contained" onPress={setPlanToRepresentativePlan} labelStyle={styles.setRepresentativeButtonLabel}>
					{i18n.t('Set this Plan to Representative one')}
				</Button>
			)}
			<PMC01202PlaceInformation />
			<CCO007GoogleBannerAd />
		</ScrollView>
	);
};
