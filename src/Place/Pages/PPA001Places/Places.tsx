import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { PPA001PlacesController } from './PlacesController';

import { BottomTabParamList } from '@/App';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList/GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList/PlacesList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { styles } from '../PPA001Places/PlacesStyle';

export const PPA001Places = ({ navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>) => {
	const { onAutoCompleteClicked, onPlaceSelected, isLoading } = PPA001PlacesController(route.params);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}
	return (
		<>
			<SafeAreaView />
			<View style={styles.container}>
				<PMC01101GoogleMapPlacesList style={styles.googleMap} />
				<PCO001SearchPlace onAutoCompleteClicked={onAutoCompleteClicked} hideCities={false} fetchDetails />
				<PMC01102PlacesList onPlaceSelected={onPlaceSelected} style={styles.placesList} />
			</View>
		</>
	);
};
