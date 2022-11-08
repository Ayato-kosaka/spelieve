import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { FlatList, View, Image, Linking } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import { styles } from './PlaceStyle';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { PMC01201GoogleMapPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01201GoogleMapPlaceOne';
import { PMC01203PlaceImage } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01203PlaceImage';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PPA002Place = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'PPA002Place'>) => {
	const { place, setPlaceId } = useContext(PCT012MPlaceOne);
	const { place_id, language } = route.params;

	useEffect(() => {
		setPlaceId(place_id);
	}, [place_id]);

	if (!place) {
		return <ActivityIndicator animating />;
	}

	return (
		<View style={styles.container}>
			<View>
				<Text>PPA002画面</Text>
				<PMC01201GoogleMapPlaceOne />
				<PMC01203PlaceImage />
				<Text style={styles.infoText}>{place.name}</Text>
				<Text style={styles.infoText}>{place.formatted_address}</Text>
				<Text style={styles.urlLink} onPress={() => Linking.openURL(`${place.website}`)}>
					{place.website}
				</Text>
				<Text style={styles.infoText}>{place.formatted_phone_number}</Text>
				{/* {place.openingHours?.forEach(openingHour => {
					return (
						<>
							<Text>{openingHour.open.day}</Text>
							<Text>{`${openingHour.open.time}-${openingHour.close.time}`}</Text>
						</>
					);
				})} */}
			</View>
			<View>
				<Text>{i18n.t('Customer reviews')}</Text>
			</View>
			<FlatList
				data={place.photoUrls}
				renderItem={(itemData) => (
					<View>
						<Image source={{ uri: itemData.item }} style={styles.image} />
					</View>
				)}
				numColumns={2}
				// keyExtractor={(place) => place.place_id}
			/>
		</View>
	);
};
