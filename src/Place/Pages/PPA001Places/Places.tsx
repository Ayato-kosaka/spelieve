import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { PPA001PlacesController } from './PlacesController';

import { BottomTabParamList } from '@/App';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList/GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList/PlacesList';

export const PPA001Places = ({ navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>) => {
	const { onAutoCompleteClicked, onPlaceSelected, isLoading } = PPA001PlacesController(route.params);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}
	return (
		<>
			<PMC01101GoogleMapPlacesList />
			<PCO001SearchPlace onAutoCompleteClicked={onAutoCompleteClicked} hideCities={false} />
			<PMC01102PlacesList onPlaceSelected={onPlaceSelected} />
		</>
	);
};
