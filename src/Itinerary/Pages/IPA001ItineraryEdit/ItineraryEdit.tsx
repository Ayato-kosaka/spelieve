import React, { useContext } from 'react';
import { ScrollView, ActivityIndicator, View, Pressable, Image } from 'react-native';
import { Headline, Button, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { IPA001ItineraryEditController } from './ItineraryEditController';
import { styles } from './ItineraryEditStyle';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO007GoogleBannerAd } from '@/Common/Components/CCO007GoogleBannerAd/GoogleBannerAd';
import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryTopTabScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';
import { IMC03103PlanGroupsEdit } from '@/Itinerary/Contexts/ICT031PlansMap/ModelComponents/IMC03103PlanGroupEdit';

export const IPA001ItineraryEdit = ({ route, navigation }: ItineraryTopTabScreenProps<'ItineraryEdit'>) => {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { isPlansLoading } = useContext(ICT031PlansMap);
	const { planGroupsQSnap, createPlanGroup } = useContext(ICT021PlanGroupsList);

	const {
		pageItinerary,
		onPressThumbnail,
		setPageItinerary,
		handleOnChange,
		updateItinerary,
		onPlanPress,
		buildCopyItineraryPreviewDL,
	} = IPA001ItineraryEditController({
		route,
		navigation,
	});

	if (
		!route.params.itineraryID ||
		!itineraryDocSnap ||
		!itineraryDocSnap.exists() ||
		isPlansLoading ||
		!planGroupsQSnap ||
		!pageItinerary
	) {
		return <ActivityIndicator animating />;
	}

	let isAnotherDay = true;
	let prevDateNumber = 0;

	return (
		<ScrollView>
			<CCO007GoogleBannerAd />
			<Pressable onPress={onPressThumbnail}>
				<MaterialCommunityIcons
					name="square-edit-outline"
					size={100}
					color="rgba(0,0,0,0.5)"
					style={styles.materialCommunityIcons}
				/>
				<Image source={{ uri: pageItinerary.imageUrl }} resizeMode="cover" style={styles.image} />
			</Pressable>
			<View style={styles.startDateComtainer}>
				<Text style={styles.startDateLabel}>{i18n.t('Start date')}</Text>
				<CCO003DateTimePicker
					value={pageItinerary.startDate}
					onChange={(event, date) => {
						if (event.type === 'set') {
							setPageItinerary({ ...pageItinerary, startDate: date! });
						}
					}}
					style={styles.startDateTimePicker}
				/>
			</View>

			{planGroupsQSnap?.docs.map((planGroupsDoc) => {
				const planGroup = planGroupsDoc.data();
				isAnotherDay = prevDateNumber !== planGroup.dayNumber;
				prevDateNumber = planGroup.dayNumber;
				return (
					<View key={planGroupsDoc.id}>
						{isAnotherDay && (
							<Headline style={styles.dayNumber}>{i18n.t('day N', { count: planGroup.dayNumber })}</Headline>
						)}
						<IMC03103PlanGroupsEdit planGroupsDoc={planGroupsDoc} onPlanPress={onPlanPress} />
					</View>
				);
			})}
			<Button
				mode="outlined"
				style={styles.button}
				labelStyle={{ color: 'black' }}
				onPress={() => {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					createPlanGroup();
				}}>
				{i18n.t('Add Plan group')}
			</Button>
			<Button
				mode="outlined"
				style={styles.button}
				labelStyle={{ color: 'black' }}
				onPress={() => {
					// TODO: https://github.com/Ayato-kosaka/spelieve/issues/461 React Navigation を見直す
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					buildCopyItineraryPreviewDL();
				}}>
				{i18n.t('copy Share URL')}
			</Button>
			<TextInput
				mode="outlined"
				label={i18n.t('Description')}
				value={pageItinerary.caption}
				onChange={handleOnChange('caption')}
				onBlur={updateItinerary}
				multiline
				style={styles.captionTextInput}
			/>
			<CCO007GoogleBannerAd />
		</ScrollView>
	);
};
