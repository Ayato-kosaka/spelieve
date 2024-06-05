import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useCallback, useContext, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import { PPA002PlaceController } from './PlaceController';
import { styles } from './PlaceStyle';

import { CCO007GoogleBannerAd } from '@/Common/Components/CCO007GoogleBannerAd/GoogleBannerAd';
import i18n from '@/Common/Hooks/i18n-js';
import { PlaceStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { PMC01201GoogleMapPlaceOne } from '@/Place/Contexts/PCT012MPlaceOne/ModelComponents/PMC01201GoogleMapPlaceOne/GoogleMapPlaceOne';
import { PMC01202PlaceInformation } from '@/Place/Contexts/PCT012MPlaceOne/ModelComponents/PMC01202PlaceInformation/PlaceInformation';
import { PCT012MPlaceOne } from '@/Place/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PPA002Place = ({ route, navigation }: PlaceStackScreenProps<'PPA002Place'>) => {
	const { place, isLoading } = useContext(PCT012MPlaceOne);
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { place_id } = route.params;
	const { onCreateItineraryClicked } = PPA002PlaceController({ route, navigation });

	const headerRight = useCallback(
		() => <MaterialCommunityIcons name="book-open-variant" size={30} onPress={() => onCreateItineraryClicked()} />,
		[onCreateItineraryClicked],
	);

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: place?.name || '',
			headerRight,
		});
	}, [navigation, place, headerRight]);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}
	if (!place) {
		return <Text style={styles.infoText}>{i18n.t('Place Not Found')}</Text>;
	}

	return (
		<ScrollView>
			<View style={styles.container}>
				<CCO007GoogleBannerAd />
				<PMC01201GoogleMapPlaceOne />
				<Image source={{ uri: place.imageUrl }} style={styles.image} />
				<PMC01202PlaceInformation />
				<CCO007GoogleBannerAd />
			</View>
		</ScrollView>
	);
};
