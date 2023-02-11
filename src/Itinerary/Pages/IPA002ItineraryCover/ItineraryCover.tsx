import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { Chip, TextInput, Searchbar, Text, Card } from 'react-native-paper';

import { IPA002ItineraryCoverController } from './ItineraryCoverController';
import { styles } from './ItineraryCoverStyle';

import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import i18n from '@/Common/Hooks/i18n-js';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';

export const IPA002ItineraryCover = ({ route, navigation }: ItineraryStackScreenProps<'ItineraryCover'>) => {
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
		onPressThumbnail,
	} = IPA002ItineraryCoverController({ route, navigation });

	if (shouldNavigate) {
		navigation.navigate('ItineraryTopTabNavigator', { screen: 'ItineraryEdit', params: { itineraryID } });
	}

	if (isLoading || !pageItinerary) {
		return <ActivityIndicator animating />;
	}

	return (
		<ScrollView>
			<Card>
				<Pressable onPress={onPressThumbnail}>
					<Image source={{ uri: pageItinerary.imageUrl }} resizeMode="cover" style={styles.image} />
				</Pressable>
				<Card.Content>
					<TextInput
						label={i18n.t('Itinerary Title')}
						value={pageItinerary.title}
						onChange={handleOnChange('title')}
						onBlur={updateItinerary}
						style={styles.titleTextInput}
					/>
					<TextInput
						label={i18n.t('Itinerary SubTitle')}
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
							placeholder={i18n.t('Add Tag')}
							value={tagSearchText}
							onChange={onTagSearchTextChanged}
							onBlur={onTagSearchTextBlur}
						/>
					</ScrollView>
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
					<TextInput
						mode="outlined"
						label={i18n.t('Description')}
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
