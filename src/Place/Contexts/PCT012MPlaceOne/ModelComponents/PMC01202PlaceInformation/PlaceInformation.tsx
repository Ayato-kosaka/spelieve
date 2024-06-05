import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext, useState, useCallback } from 'react';
import { Linking, View, Image } from 'react-native';
import { Headline, List, Text } from 'react-native-paper';
import { Rating } from 'react-native-ratings';

import { PCT012MPlaceOne } from '../../MPlaceOne';

import { styles } from './PlaceInformationStyle';

import i18n from '@/Common/Hooks/i18n-js';
import { materialColors, secondaryColorNm } from '@/ThemeProvider';

export const PMC01202PlaceInformation = () => {
	const { place } = useContext(PCT012MPlaceOne);
	const [expanded, setExpanded] = useState<boolean>(false);
	const openingHourLeft = useCallback(
		() => (
			<MaterialCommunityIcons
				name="clock-time-three-outline"
				size={22}
				color={materialColors[secondaryColorNm].a400}
				style={styles.materialCommunityIcons}
			/>
		),
		[],
	);

	if (!place) {
		return <View />;
	}

	return (
		<View>
			<View style={styles.infoContainer}>
				<MaterialCommunityIcons
					name="google-maps"
					size={22}
					color={materialColors[secondaryColorNm].a400}
					style={styles.materialCommunityIcons}
				/>
				<Text style={styles.infoText}>{place.formatted_address}</Text>
			</View>
			{place.website && (
				<View style={styles.infoContainer}>
					<MaterialCommunityIcons
						name="web"
						size={22}
						color={materialColors[secondaryColorNm].a400}
						style={styles.materialCommunityIcons}
					/>
					<Text
						style={styles.infoText}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							Linking.openURL(place.website!);
						}}>
						{place.website}
					</Text>
				</View>
			)}
			{place.formatted_phone_number && (
				<View style={styles.infoContainer}>
					<MaterialCommunityIcons
						name="phone-in-talk"
						size={22}
						color={materialColors[secondaryColorNm].a400}
						style={styles.materialCommunityIcons}
					/>
					<Text
						style={styles.infoText}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							Linking.openURL(`tel:${place.formatted_phone_number!}`);
						}}>
						{place.formatted_phone_number}
					</Text>
				</View>
			)}

			<List.Accordion
				title={i18n.t('Opening Hours')}
				style={styles.infoContainer}
				titleStyle={{ color: 'black' }}
				left={openingHourLeft}
				expanded={expanded}
				onPress={() => setExpanded(!expanded)}>
				{Array.isArray(place.openingHours) ? (
					place.openingHours.map(([day, time]) => (
						<Text key={`${day}${time}`} style={styles.openingHourText}>
							{day} {time}
						</Text>
					))
				) : (
					<Text style={styles.openingHourText}>{place.openingHours}</Text>
				)}
			</List.Accordion>
			<View style={styles.ratingContainer}>
				<Headline>{i18n.t('Customer Reviews')}</Headline>
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
			<View style={styles.imageListContainer}>
				{place.photoUrls.map((photoUrl) => (
					<View key={photoUrl} style={styles.imageContainer}>
						<Image source={{ uri: photoUrl }} style={styles.imageItem} />
					</View>
				))}
			</View>
			{place.mapUrl && place.photoUrls.length > 0 && (
				<Text
					style={styles.urlLink}
					onPress={() => {
						// eslint-disable-next-line @typescript-eslint/no-floating-promises
						Linking.openURL(`${place.mapUrl!}`);
					}}>
					{i18n.t('Show more Info at Google Map')}
				</Text>
			)}
		</View>
	);
};
