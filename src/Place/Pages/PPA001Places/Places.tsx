import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

import { PPA001PlacesController } from './PlacesController';

import { BottomTabParamList } from '@/App';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList/PlacesList';

export const PPA001Places = ({ navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>) => {
	const { onAutoCompleteClicked } = PPA001PlacesController();
	const { country, administrativeAreaLevel1, administrativeAreaLevel2, locality } = route.params;

	return (
		<>
			<PMC01101GoogleMapPlacesList />
			<PCO001SearchPlace onAutoCompleteClicked={onAutoCompleteClicked} />
			<PMC01102PlacesList />
		</>
	);
};
