import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MediaTypeOptions } from 'expo-image-picker';
import { ActivityIndicator, Dimensions, ScrollView, View } from 'react-native';
import { Chip, TextInput, Searchbar, Text, Card } from 'react-native-paper';

import { IPA002ItineraryCoverController } from './ItineraryCoverController';

import { BottomTabParamList } from '@/App';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import { CCO006ImagePicker } from '@/Common/Components/CCO006ImagePicker/ImagePicker';
import i18n from '@/Common/Hooks/i18n-js';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';
import { materialColors, primaryColorNm } from '@/ThemeProvider';

export const IPA002ItineraryCover = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA002ItineraryCover'>) => {
	const { itineraryID } = route.params;
	const { pageItinerary, updateItinerary, handleOnChange, deleteTag, shouldNavigate, isLoading, setPageItinerary } =
		IPA002ItineraryCoverController({ itineraryID });

	if (shouldNavigate) {
		navigation.navigate('Itinerary', { screen: 'IPA001ItineraryEdit', params: { itineraryID } });
	}

	if (isLoading || !pageItinerary) {
		return <ActivityIndicator animating />;
	}

	// TODO: ↓Style に切り出す
	const WINDOW = Dimensions.get('window');
	/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/300 Itinerary の style を修正する */

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
					storage={storage}>
					<Card.Cover source={{ uri: pageItinerary.imageUrl }} />
				</CCO006ImagePicker>
				<Card.Content style={{ justifyContent: 'space-around', height: 700 }}>
					<TextInput
						label={i18n.t('旅行のタイトル')}
						value={pageItinerary.title}
						onChange={handleOnChange('title')}
						onBlur={updateItinerary}
						style={{
							backgroundColor: '#fff',
						}}
					/>
					<TextInput
						label={i18n.t('旅行のサブタイトル')}
						value={pageItinerary.subTitle}
						onChange={handleOnChange('subTitle')}
						onBlur={updateItinerary}
						style={{
							backgroundColor: '#fff',
						}}
					/>
					<View style={{ flexDirection: 'row' }}>
						{pageItinerary.tags.map((tag, index) => (
							<Chip
								key={tag}
								style={{
									backgroundColor: materialColors[primaryColorNm]['50'],
								}}
								textStyle={{
									color: materialColors[primaryColorNm][400],
								}}
								closeIcon="close-circle"
								onClose={() => deleteTag(index)}>
								{tag}
							</Chip>
						))}
						{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/298 Tagを取得するSearchBarを実装する */}
						<Searchbar placeholder="Search" value="" />
					</View>
					<View style={{ zIndex: 1 }}>
						<Text style={{ color: materialColors.grey[700] }}>{i18n.t('旅行の滞在開始日')}</Text>
						<CCO003DateTimePicker
							value={pageItinerary.startDate}
							onChange={(event, date) => {
								if (event.type === 'set') {
									setPageItinerary({ ...pageItinerary, startDate: date! });
								}
							}}
							style={{ backgroundColor: '#fff' }}
						/>
					</View>
					<TextInput
						mode="outlined"
						label={i18n.t('旅行のキャプション')}
						value={pageItinerary.caption}
						onChange={handleOnChange('caption')}
						onBlur={updateItinerary}
						multiline
						style={{
							height: 400,
							backgroundColor: '#fff',
						}}
					/>
				</Card.Content>
			</Card>
		</ScrollView>
	);
};
