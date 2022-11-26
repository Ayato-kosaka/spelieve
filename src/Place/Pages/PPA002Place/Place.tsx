import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PPA002PlaceController } from './PlaceController';
import { styles } from './PlaceStyle';

import { BottomTabParamList } from '@/App';
import i18n from '@/Common/Hooks/i18n-js';
import { PMC01201GoogleMapPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01201GoogleMapPlaceOne/GoogleMapPlaceOne';
import { PMC01202PlaceInformation } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';
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
				<PMC01201GoogleMapPlaceOne />
				<Image source={{ uri: place.imageUrl }} style={styles.image} />
				<Text style={styles.infoText}>{place.name}</Text>
				<MaterialCommunityIcons name="book-open-variant" size={50} onPress={() => onCreateItineraryClicked()} />
				<PMC01202PlaceInformation />
			</View>
		</ScrollView>
	);
};
