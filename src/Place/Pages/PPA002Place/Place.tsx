import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { FlatList, View, Image, Linking, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import BookIcon from 'react-native-vector-icons/Entypo';
import FetherIcon from 'react-native-vector-icons/Feather';
import WebIcon from 'react-native-vector-icons/Foundation';
import TimeIcon from 'react-native-vector-icons/Ionicons';

import { PPA002PlaceController } from './PlaceController';
import { styles } from './PlaceStyle';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { PMC01201GoogleMapPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01201GoogleMapPlaceOne/GoogleMapPlaceOne';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PPA002Place = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'PPA002Place'>) => {
	const { place, isLoading } = useContext(PCT012MPlaceOne);
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { place_id } = route.params;
	const { onCreateItineraryClicked } = PPA002PlaceController(route.params);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}
	if (!place) {
		return <Text style={styles.infoText}>{i18n.t('Place Not Found')}</Text>;
	}

	return (
		<ScrollView>
			<View style={styles.container}>
				<View>
					<PMC01201GoogleMapPlaceOne />
					<Image source={{ uri: place.imageUrl }} style={styles.image} />
					<Text style={styles.infoText}>{place.name}</Text>
					<BookIcon name="open-book" size={50} onPress={() => onCreateItineraryClicked(place.name)} />
					<FetherIcon name="map-pin" size={20}>
						<Text style={styles.infoText}>{place.formatted_address}</Text>
					</FetherIcon>
					<WebIcon name="web" size={20}>
						<Text
							style={styles.urlLink}
							onPress={() => {
								// eslint-disable-next-line
								Linking.openURL(`${place.website || ''}`);
							}}>
							{place.website ? place.website : i18n.t('No Web Infomation')}
						</Text>
					</WebIcon>
					<FetherIcon name="phone-call" size={20}>
						<Text style={styles.infoText}>
							{place.formatted_phone_number ? place.formatted_phone_number : i18n.t('No Tel Information')}
						</Text>
					</FetherIcon>
					<View>
						<TimeIcon name="time-outline" size={20}>
							<Text style={styles.infoText}>{i18n.t('Opening Hours')}</Text>
						</TimeIcon>
						{Array.isArray(place.openingHours) ? (
							<FlatList
								data={place.openingHours}
								renderItem={(itemData) => {
									const [day, time] = itemData.item;
									return (
										<View>
											<Text style={styles.infoText}>
												{day} {time}
											</Text>
										</View>
									);
								}}
								numColumns={1}
							/>
						) : (
							<Text style={styles.infoText}>{place.openingHours}</Text>
						)}
						<Text
							style={styles.urlLink}
							onPress={() => {
								// eslint-disable-next-line
								Linking.openURL(`${place.mapUrl}`);
							}}>
							{i18n.t('show more')}
						</Text>
					</View>
				</View>
				<View>
					<Text style={styles.infoText}>{i18n.t('Customer Reviews')}</Text>
					<Rating type="star" readonly jumpValue={0.1} startingValue={place.rating} />
					<Text
						style={styles.urlLink}
						onPress={() => {
							// eslint-disable-next-line
							Linking.openURL(`${place.mapUrl}`);
						}}
					/>
				</View>
				<View>
					<FlatList
						data={place.photoUrls}
						renderItem={(itemData) => (
							<View>
								<Image source={{ uri: itemData.item }} style={styles.imagelist} />
							</View>
						)}
						numColumns={3}
						// keyExtractor={(place) => place.place_id}
					/>
					<Text
						style={styles.urlLink}
						onPress={() => {
							// eslint-disable-next-line
							Linking.openURL(`${place.mapUrl}`);
						}}
					/>
				</View>
			</View>
		</ScrollView>
	);
};
