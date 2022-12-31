import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MediaTypeOptions } from 'expo-image-picker';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { Chip, TextInput, Searchbar, Text, Card } from 'react-native-paper';

import { IPA002ItineraryCoverController } from './ItineraryCoverController';
import { styles } from './ItineraryCoverStyle';

import { BottomTabParamList } from '@/App';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO006ImagePicker } from '@/Common/Components/CCO006ImagePicker/ImagePicker';
import i18n from '@/Common/Hooks/i18n-js';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';

export const IPA002ItineraryCover = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA002ItineraryCover'>) => {
	const { itineraryID } = route.params;
	const {
		pageItinerary,
		updateItinerary,
		handleOnChange,
		tagSearchText,
		onTagSearchTextChanged,
		onTagSearchTextBlur,
		deleteTag,
		shouldNavigate,
		isLoading,
		setPageItinerary,
	} = IPA002ItineraryCoverController({ itineraryID });

	if (shouldNavigate) {
		navigation.navigate('Itinerary', { screen: 'IPA001ItineraryEdit', params: { itineraryID } });
	}

	if (isLoading || !pageItinerary) {
		return <ActivityIndicator animating />;
	}

	return (
		<ScrollView>
			<Card>
				<CCO006ImagePicker
					onPickImage={(imageUrl) => {
						setPageItinerary({ ...pageItinerary, imageUrl });
					}}
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
					<Image source={{ uri: pageItinerary.imageUrl }} resizeMode="cover" style={styles.image} />
				</CCO006ImagePicker>
				<Card.Content>
					<TextInput
						label={i18n.t('旅行のタイトル')}
						value={pageItinerary.title}
						onChange={handleOnChange('title')}
						onBlur={updateItinerary}
						style={styles.titleTextInput}
					/>
					<TextInput
						label={i18n.t('旅行のサブタイトル')}
						value={pageItinerary.subTitle}
						onChange={handleOnChange('subTitle')}
						onBlur={updateItinerary}
						style={styles.subTitleTextInput}
					/>
					<ScrollView horizontal style={styles.chipContainer}>
						{pageItinerary.tags.map((tag, index) => (
							<Chip
								key={`${tag}${index.toString()}`}
								mode="outlined"
								style={styles.tagsChip}
								textStyle={styles.tagsChipText}
								closeIcon="close-circle"
								onClose={() => deleteTag(index)}>
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
					<View style={{ zIndex: 1 }}>
						<Text style={styles.startDateLabel}>{i18n.t('旅行の滞在開始日')}</Text>
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
					<TextInput
						mode="outlined"
						label={i18n.t('旅行のキャプション')}
						value={pageItinerary.caption}
						onChange={handleOnChange('caption')}
						onBlur={updateItinerary}
						multiline
						style={styles.captionTextInput}
					/>
				</Card.Content>
			</Card>
		</ScrollView>
	);
};
