import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { TextInput, Text, Card } from 'react-native-paper';

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
