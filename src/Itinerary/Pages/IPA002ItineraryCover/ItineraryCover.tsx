import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MediaTypeOptions } from 'expo-image-picker';
import { ActivityIndicator, Dimensions, Image, ScrollView, View } from 'react-native';
import { Chip, TextInput, Searchbar, Text } from 'react-native-paper';

import { IPA002ItineraryCoverController } from './ItineraryCoverController';

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
			<CCO006ImagePicker
				onPickImage={(imageUrl) => setPageItinerary({ ...pageItinerary, imageUrl })}
				imagePickerOptions={{
					allowsEditing: true,
					allowsMultipleSelection: false,
					mediaTypes: MediaTypeOptions.Images,
					aspect: [1, 1],
					quality: 1,
				}}
				storage={storage}>
				{pageItinerary.imageUrl ? (
					/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/303 IPA002ItineraryCover の画像を修正可能にする */
					<Image
						source={{ uri: pageItinerary.imageUrl }}
						style={{
							height: WINDOW.width,
							width: WINDOW.width,
						}}
					/>
				) : (
					<View />
				)}
			</CCO006ImagePicker>
			<TextInput
				label={i18n.t('旅行のタイトル')}
				value={pageItinerary.title}
				onChange={handleOnChange('title')}
				onBlur={updateItinerary}
			/>
			<TextInput
				label={i18n.t('旅行のサブタイトル')}
				value={pageItinerary.subTitle}
				onChange={handleOnChange('subTitle')}
				onBlur={updateItinerary}
			/>
			<View style={{ flexDirection: 'row' }}>
				{pageItinerary.tags.map((tag, index) => (
					<Chip key={tag} closeIcon="close-circle" onClose={() => deleteTag(index)}>
						{tag}
					</Chip>
				))}
				{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/298 Tagを取得するSearchBarを実装する */}
				<Searchbar placeholder="Search" value="" />
			</View>
			<View>
				<Text>{i18n.t('旅行の滞在開始日')}</Text>
				<CCO003DateTimePicker
					value={pageItinerary.startDate}
					onChange={(event, date) => {
						if (event.type === 'set') {
							setPageItinerary({ ...pageItinerary, startDate: date! });
						}
					}}
				/>
			</View>
			<TextInput
				label={i18n.t('旅行のキャプション')}
				value={pageItinerary.caption}
				onChange={handleOnChange('caption')}
				onBlur={updateItinerary}
				multiline
			/>
		</ScrollView>
	);
};
