import { useContext } from 'react';
import { FlatList, Linking, View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PCT012MPlaceOne } from '../../MPlaceOne';

import { styles } from './PlaceInformationStyle';

import i18n from '@/Common/Hooks/i18n-js';

export const PMC01202PlaceInformation = () => {
	const { place } = useContext(PCT012MPlaceOne);

	if (!place) {
		return <View />;
	}

	return (
		<View>
			<MaterialCommunityIcons name="google-maps" size={20}>
				<Text style={styles.infoText}>{place.formatted_address}</Text>
			</MaterialCommunityIcons>
			{place.website && (
				<MaterialCommunityIcons name="web" size={20}>
					<Text
						style={styles.urlLink}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							Linking.openURL(place.website!);
						}}>
						{place.website}
					</Text>
				</MaterialCommunityIcons>
			)}
			{place.formatted_phone_number && (
				<MaterialCommunityIcons name="phone-in-talk" size={20}>
					<Text
						style={styles.infoText}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							Linking.openURL(`tel:${place.formatted_phone_number!}`);
						}}>
						{place.formatted_phone_number}
					</Text>
				</MaterialCommunityIcons>
			)}
			<View>
				<MaterialCommunityIcons name="clock-time-three-outline" size={20}>
					<Text style={styles.infoText}>{i18n.t('Opening Hours')}</Text>
				</MaterialCommunityIcons>
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
			</View>
			<View>
				<Text style={styles.infoText}>{i18n.t('Customer Reviews')}</Text>
				<Rating type="star" readonly jumpValue={0.1} startingValue={place.rating} />
				<Text
					style={styles.urlLink}
					onPress={() => {
						// eslint-disable-next-line
						Linking.openURL(`${place.mapUrl}`);
					}}>
					{i18n.t('show more info at Google Map')}
				</Text>
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
					}}>
					{i18n.t('show more')}
				</Text>
			</View>
		</View>
	);
};
