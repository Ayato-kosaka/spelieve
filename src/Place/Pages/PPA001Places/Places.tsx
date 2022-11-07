import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';

import { PPA001PlacesController } from './PlacesController';

import { BottomTabParamList } from '@/App';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList/GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList/PlacesList';

export const PPA001Places = ({ navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>) => {
	const { onAutoCompleteClicked, onPlaceSelected } = PPA001PlacesController();
	const { setAddress } = useContext(PCT011MPlacesList);
	const { country, administrativeAreaLevel1, administrativeAreaLevel2, locality } = route.params;

	useEffect(() => {
		if (country) {
			setAddress({ country, administrativeAreaLevel1, administrativeAreaLevel2, locality });
		} else {
			// TODO: 現在地から取得
			setAddress({ country: '日本', administrativeAreaLevel1: '神奈川県', locality: '横浜市' });
		}
	}, [country, administrativeAreaLevel1, administrativeAreaLevel2, locality]);

	return (
		<>
			<PMC01101GoogleMapPlacesList />
			<PCO001SearchPlace onAutoCompleteClicked={onAutoCompleteClicked} />
			<PMC01102PlacesList onPlaceSelected={onPlaceSelected} />
		</>
	);
};
