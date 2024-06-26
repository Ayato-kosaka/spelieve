import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

import { IPA003EditPlanController } from './EditPlanController';
import { styles } from './EditPlanStyle';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO004DurationPicker } from '@/Common/Components/CCO004DurationPicker/DurationPicker';
import { CCO007GoogleBannerAd } from '@/Common/Components/CCO007GoogleBannerAd/GoogleBannerAd';
import i18n from '@/Common/Hooks/i18n-js';
import { RootStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { PCO002GooglePlacesAutocomplete } from '@/Place/Components/PCO002GooglePlacesAutocomplete';
import { PCT012MPlaceOneProvider } from '@/Place/Contexts/PCT012MPlaceOne';
import { PMC01202PlaceInformation } from '@/Place/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';

export const IPA003EditPlanBody = ({ route, navigation }: RootStackScreenProps<'EditPlan'>) => {
	const {
		planGroup,
		isRepresentativePlan,
		plan,
		onPressThumbnail,
		updateRepresentativeStartDateTime,
		setPlanToRepresentativePlan,
		onAutocompleteClicked,
		onChangeMemo,
		onBlurSpan,
	} = IPA003EditPlanController({ route, navigation });

	if (planGroup === undefined || plan === undefined) {
		return <ActivityIndicator animating />;
	}

	return (
		<ScrollView>
			<CCO007GoogleBannerAd />
			<Pressable testID="planThumbnailPressable" onPress={onPressThumbnail}>
				<MaterialCommunityIcons
					name="square-edit-outline"
					size={100}
					color="rgba(0,0,0,0.5)"
					style={styles.materialCommunityIcons}
				/>
				<Image source={{ uri: plan.imageUrl }} resizeMode="cover" style={styles.image} />
			</Pressable>
			<PCO002GooglePlacesAutocomplete
				onAutocompleteClicked={onAutocompleteClicked}
				onlySpot
				fetchDetails={false}
				placeholder={i18n.t('Search Place')}
			/>
			{/* TextInput.props.value に undefined を設定するとエラーになる。本来は DB を必須にすべき？ */}
			<TextInput label={i18n.t('Memo')} value={plan.memo || ''} onChange={onChangeMemo} style={styles.memoTextInput} />
			<CCO004DurationPicker
				value={plan.placeSpan}
				label={i18n.t('Stay time')}
				onBlur={onBlurSpan}
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
							value={planGroup.representativeStartDateTime}
							onChange={updateRepresentativeStartDateTime}
							mode="date"
						/>
						<CCO003DateTimePicker
							style={styles.representativeStartDateTimePicker}
							value={planGroup.representativeStartDateTime}
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

export const IPA003EditPlan = ({ route, navigation }: RootStackScreenProps<'EditPlan'>) => (
	<PCT012MPlaceOneProvider>
		<IPA003EditPlanBody route={route} navigation={navigation} />
	</PCT012MPlaceOneProvider>
);
