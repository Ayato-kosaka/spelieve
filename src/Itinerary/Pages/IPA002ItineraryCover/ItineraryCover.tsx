import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { Chip, TextInput, Searchbar, Text } from 'react-native-paper';

import { IPA002ItineraryCoverController } from './ItineraryCoverController';

import { BottomTabParamList } from '@/App';
import { CCO003DateTimePicker } from '@/Common/Components/CCO003DateTimePicker';
import i18n from '@/Common/Hooks/i18n-js';

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

	/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/300 Itinerary の style を修正する */

	return (
		<ScrollView>
			{pageItinerary.imageUrl && (
				/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/303 IPA002ItineraryCover の画像を修正可能にする */
				<Image
					source={{ uri: pageItinerary.imageUrl }}
					style={{
						height: 100,
						width: 100,
					}}
				/>
			)}
			<TextInput
				label={i18n.t('タイトル')}
				value={pageItinerary.title}
				onChange={handleOnChange('title')}
				onBlur={updateItinerary}
			/>
			<TextInput
				label={i18n.t('サブタイトル')}
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
				<Text>{i18n.t('滞在開始日')}</Text>
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
				label={i18n.t('キャプション')}
				value={pageItinerary.caption}
				onChange={handleOnChange('caption')}
				onBlur={updateItinerary}
				multiline
			/>
		</ScrollView>
	);
};
