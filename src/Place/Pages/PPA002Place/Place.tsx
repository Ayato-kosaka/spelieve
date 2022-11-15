import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { ReactNode, useContext, useEffect } from 'react';
import { FlatList, View, Image, Linking, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';

import { styles } from './PlaceStyle';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { PMC01201GoogleMapPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01201GoogleMapPlaceOne/GoogleMapPlaceOne';
import { PMC01203PlaceImage } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01203PlaceImage';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';
import { MPlaceOpeningHoursInterface } from 'spelieve-common/lib/Interfaces';
import { PPA002PlaceController } from './PlaceController';
import BookIcon from 'react-native-vector-icons/Entypo';
import FetherIcon from 'react-native-vector-icons/Feather'
import WebIcon from 'react-native-vector-icons/Foundation'
import TimeIcon from 'react-native-vector-icons/Ionicons'
import { Rating } from 'react-native-ratings';

export const PPA002Place = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'PPA002Place'>) => {
	const { place, setPlaceId } = useContext(PCT012MPlaceOne);
	const { place_id, language } = route.params;
	const {
		onCreateItineraryClicked, 
		onShowMoreDetailClicked,
		onShowMoreReviewClicked,
		onImageClicked,
		onShowMoreImageClicked,
	} = PPA002PlaceController(route.params);

	useEffect(() => {
		setPlaceId(place_id);
	}, [place_id]);

	if (!place) {
		return <ActivityIndicator animating />;
	}

	const outputOpeningHour = (openingHours: MPlaceOpeningHoursInterface[] | undefined): ReactNode => {
		const days = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
		const changeTimeView = (time: string): string => { // 1300->13:00
			const hours = time.slice(0, 2);
			const minutes = time.slice(2, 4);
			return hours + ':' + minutes;
		}

		if (openingHours) {
			if (openingHours.length === 1) { // 24時間営業(ホテル、公園etc)
				return <Text style={styles.infoText}>24時間営業</Text>
			}
			return openingHours.map(openingHour => {
				const open = openingHour.open;
				const close = openingHour.close;
				const day = days[parseInt(open.day)];
				return (
					<View>
						<Text style={styles.infoText}>{i18n.t(day)}	{i18n.t(changeTimeView(open.time))}~{i18n.t(changeTimeView(close.time))}</Text>
					</View>
				);
			});
		}
		return <Text style={styles.infoText}>営業時間の情報はありません</Text>;
	};

	return (
		<ScrollView>
			<View style={styles.container}>
				<View>
					<Text>PPA002画面</Text>
					<PMC01201GoogleMapPlaceOne />
					<PMC01203PlaceImage />
					<Text style={styles.infoText}>{place.name}</Text>
					<BookIcon name='open-book' size={50} onPress={() => onCreateItineraryClicked(place.name)} />
					<FetherIcon name='map-pin' size={20}>
						<Text style={styles.infoText}>{place.formatted_address}</Text>
					</FetherIcon>
					<WebIcon name='web' size={20}>
						<Text style={styles.urlLink} onPress={() => Linking.openURL(`${place.website}`)}>
							{place.website}
						</Text>
					</WebIcon>
					<FetherIcon name='phone-call' size={20}>
						<Text style={styles.infoText}>{place.formatted_phone_number ? place.formatted_phone_number : i18n.t('No Tel Information')}</Text>
					</FetherIcon>
					<View>
						<TimeIcon name='time-outline' size={20}>
							<Text style={styles.infoText}>{i18n.t('Opening Hours')}</Text>
						</TimeIcon>
						{outputOpeningHour(place.openingHours)}
					</View>
				</View>
				<View>
					<Text style={styles.infoText}>{i18n.t('Customer Reviews')}</Text>
					<Rating 
						type='star'
						readonly={true}
						jumpValue={0.1}
						startingValue={place.rating}
					/>
				</View>
				<FlatList
					data={place.photoUrls}
					renderItem={(itemData) => (
						<View>
							<Image source={{ uri: itemData.item }} style={styles.image} />
						</View>
					)}
					numColumns={3}
				// keyExtractor={(place) => place.place_id}
				/>
			</View>
		</ScrollView>
	);
};
