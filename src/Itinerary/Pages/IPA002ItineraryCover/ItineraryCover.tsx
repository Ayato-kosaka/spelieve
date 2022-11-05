import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TextInputChangeEventData, ScrollView } from 'react-native';
import { Chip, TextInput, Searchbar } from 'react-native-paper';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

export function IPA002ItineraryCover({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA002ItineraryCover'>) {
	const { itineraryID } = route.params;

	// TODO: あとで消す ?itineraryID=uMFhF6OQph2UUuKEsKNa

	// ここから Controller
	const [pageItinerary, setPageItinerary] = useState<ItineraryOneInterface | undefined>(undefined);
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

	useEffect(() => {
		if (itineraryDocSnap?.exists()) {
			setPageItinerary(itineraryDocSnap.data());
		}
	}, [itineraryDocSnap]);

	const updateItinerary = () => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc<ItineraryOneInterface>(itineraryDocSnap!.ref, { ...pageItinerary! });
	};

	const handleOnChange =
		(column: keyof ItineraryOneInterface) =>
		({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => {
			setPageItinerary({ ...pageItinerary!, [column]: nativeEvent.text });
		};

	const deleteTag = (index: number): void => {
		const newTags: string[] = pageItinerary!.tags.splice(index, 1);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc<ItineraryOneInterface>(itineraryDocSnap!.ref, { ...pageItinerary!, tags: newTags });
	};

	const isLoading = !itineraryDocSnap;

	if (!itineraryID || (itineraryDocSnap && !itineraryDocSnap.exists())) {
		navigation.navigate('Itinerary', { screen: 'IPA001ItineraryEdit', params: { itineraryID } });
	}

	// ここまでController

	if (isLoading || !pageItinerary) {
		return <ActivityIndicator animating />;
	}

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
					<Searchbar placeholder="Search" value="TODO: https://github.com/Ayato-kosaka/spelieve/issues/298" />
				}
			/>
			<TextInput
				label={i18n.t('滞在開始日')}
				value={`${pageItinerary.startDate.getMonth() + 1}/${pageItinerary.startDate.getDate()}`}
				onChange={handleOnChange('startDate')}
				onBlur={updateItinerary}
			/>
			{/* TODO: https://github.com/Ayato-kosaka/spelieve/issues/299 */}
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
