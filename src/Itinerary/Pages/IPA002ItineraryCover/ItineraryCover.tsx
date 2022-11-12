import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import { Chip, TextInput, Searchbar } from 'react-native-paper';

import { IPA002ItineraryCoverController } from './ItineraryCoverController';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';

export function IPA002ItineraryCover({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA002ItineraryCover'>) {
	const { itineraryID } = route.params;
	const { pageItinerary, updateItinerary, handleOnChange, deleteTag, shouldNavigate, isLoading } =
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
				<Image
					source={{ uri: pageItinerary.imageUrl }}
					style={{
						height: '100vw',
						width: '100vw',
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
			<FlatList
				data={pageItinerary.tags}
				horizontal
				renderItem={(renderItemInfo) => (
					<Chip closeIcon="close-circle" onClose={() => deleteTag(renderItemInfo.index)}>
						{renderItemInfo.item}
					</Chip>
				)}
				ListFooterComponent={
					/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/298 Tagを取得するSearchBarを実装する */
					<Searchbar placeholder="Search" value="" />
				}
			/>
			{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/299 DatePickerを実装する */}
			<TextInput
				label={i18n.t('滞在開始日')}
				value={`${pageItinerary.startDate.getMonth() + 1}/${pageItinerary.startDate.getDate()}`}
				onChange={handleOnChange('startDate')}
				onBlur={updateItinerary}
			/>
			<TextInput
				label={i18n.t('キャプション')}
				value={pageItinerary.caption}
				onChange={handleOnChange('caption')}
				onBlur={updateItinerary}
				multiline
			/>
		</ScrollView>
	);
}