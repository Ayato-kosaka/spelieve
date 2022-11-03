import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TextInputChangeEventData } from 'react-native';
import { Chip, TextInput } from 'react-native-paper';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';





export function IPA002ItineraryCover({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA002ItineraryCover'>) {
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { itineraryID } = route.params;

	// TODO: あとで消す ?itineraryID=uMFhF6OQph2UUuKEsKNa

	const [pageItinerary, setPageItinerary] = useState<ItineraryOneInterface | undefined>(undefined);
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

	if (!itineraryID || (itineraryDocSnap && !itineraryDocSnap.exists())) {
		navigation.navigate('Itinerary', { screen: 'IPA001ItineraryEdit', params: { itineraryID } });
		return <></>;
	}

	if (!itineraryDocSnap || !pageItinerary) {
		return <ActivityIndicator animating />;
	}

	const updateItinerary = () => {
		setDoc<ItineraryOneInterface>(itineraryDocSnap.ref, pageItinerary);
	};

	const handleOnChange = (column: keyof ItineraryOneInterface) => ({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => {
			setPageItinerary({ ...pageItinerary, [column]: nativeEvent.text });
		};

	const itinerary: ItineraryOneInterface = itineraryDocSnap.data();
	return (
		<>
			{itinerary.imageUrl && (
				<Image
					source={{ uri: itinerary.imageUrl }}
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
			<FlatList data={pageItinerary.tags} renderItem={(renderItemInfo) => <Chip>{renderItemInfo.item}</Chip>} />
			<TextInput
				label={i18n.t('滞在開始日')}
				value={`${pageItinerary.startDate.getMonth() + 1}/${pageItinerary.startDate.getDate()}`}
				onChange={handleOnChange('startDate')}
				onBlur={updateItinerary}
			/>
			{/* TODO: DatePicker に修正する。 */}
			<TextInput
				label={i18n.t('キャプション')}
				value={pageItinerary.caption}
				onChange={handleOnChange('caption')}
				onBlur={updateItinerary}
				multiline
			/>
		</>
	);
}
