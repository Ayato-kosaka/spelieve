import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PPA001PlacesController } from './PlacesController';
import { styles } from './PlacesStyle';

import { PlaceStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { PCO002GooglePlacesAutocomplete } from '@/Place/Components/PCO002GooglePlacesAutocomplete/GooglePlacesAutocomplete';
import { PMC01101GoogleMapPlacesList } from '@/Place/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList/GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList/PlacesList';

export const PPA001Places = ({ navigation, route }: PlaceStackScreenProps<'PPA001Places'>) => {
	const { onAutocompleteClicked, onPlaceSelected, isLoading } = PPA001PlacesController({ navigation, route });

	if (isLoading) {
		return <ActivityIndicator animating />;
	}
	return (
		<>
			<SafeAreaView />
			<View style={styles.container}>
				<PMC01101GoogleMapPlacesList style={styles.googleMap} />
				<PCO002GooglePlacesAutocomplete onAutocompleteClicked={onAutocompleteClicked} onlySpot={false} fetchDetails />
				<PMC01102PlacesList onPlaceSelected={onPlaceSelected} style={styles.placesList} />
			</View>
		</>
	);
};
