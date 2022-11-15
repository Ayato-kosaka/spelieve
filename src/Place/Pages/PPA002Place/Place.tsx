import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { ReactNode, useContext, useEffect, useMemo } from 'react';
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
	const { onCreateItineraryClicked, displayOpeningHours } = PPA002PlaceController(route.params);
	let openingInfo;

	useEffect(() => {
		setPlaceId(place_id);
	}, [place_id]);
	
	if (!place) {
		return <ActivityIndicator animating />;
	}

	if (place) {
		openingInfo = displayOpeningHours(place.openingHours);
	}
	
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
							{place.website ? place.website : i18n.t('No Web Infomation')}
						</Text>
					</WebIcon>
					<FetherIcon name='phone-call' size={20}>
						<Text style={styles.infoText}>{place.formatted_phone_number ? place.formatted_phone_number : i18n.t('No Tel Information')}</Text>
					</FetherIcon>
					<View>
						<TimeIcon name='time-outline' size={20}>
							<Text style={styles.infoText}>{i18n.t('Opening Hours')}</Text>
						</TimeIcon>
						{ 
						 Array.isArray(openingInfo) 
							? (<FlatList 
								data={openingInfo}
								renderItem={(itemData) => {
									const [day, time] = itemData.item;
									return (
										<View>
											<Text style={styles.infoText}>{day} {time}</Text>
										</View>
									);
								}}
								numColumns={1}
							/>)
							: (<Text style={styles.infoText}>{openingInfo}</Text>)
						}
						<Text style={styles.urlLink} onPress={() => Linking.openURL(`${place.mapUrl}`)}>{i18n.t('show more')}</Text>
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
					<Text style={styles.urlLink} onPress={() => Linking.openURL(`${place.mapUrl}`)}>{i18n.t('show more')}</Text>
				</View>
				<View>
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
					<Text style={styles.urlLink} onPress={() => Linking.openURL(`${place.mapUrl}`)}>{i18n.t('show more')}</Text>
				</View>
			</View>
		</ScrollView>
	);
};
