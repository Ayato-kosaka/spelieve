import { useContext } from 'react';
import { Linking, View, Image } from 'react-native';
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
					place.openingHours.map(([day, time]) => (
						<View key={`${day}${time}`}>
							<Text style={styles.infoText}>
								{day} {time}
							</Text>
						</View>
					))
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
					{i18n.t('Show more Info at Google Map')}
				</Text>
			</View>
			<View>
				{place.photoUrls.map((photoUrl) => (
					<View key={photoUrl}>
						<Image source={{ uri: photoUrl }} style={styles.imagelist} />
					</View>
				))}
				{place.mapUrl && (
					<Text
						style={styles.urlLink}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							Linking.openURL(`${place.mapUrl!}`);
						}}>
						{i18n.t('Show more')}
					</Text>
				)}
			</View>
		</View>
	);
};
