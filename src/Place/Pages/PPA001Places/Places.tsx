import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { PPA001PlacesController } from './PlacesController';

import { BottomTabParamList } from '@/App';
import { PCO001SearchPlace } from '@/Place/Components/PCO001SearchPlace/SearchPlace';
import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PMC01101GoogleMapPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01101GoogleMapPlacesList/GoogleMapPlacesList';
import { PMC01102PlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList/ModelComponents/PMC01102PlacesList/PlacesList';

export const PPA001Places = ({ navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>) => {
	const { onAutoCompleteClicked, onPlaceSelected } = PPA001PlacesController();
	const { setAddress, isFirstLoading } = useContext(PCT011MPlacesList);
	const { country, administrativeAreaLevel1, administrativeAreaLevel2, locality } = route.params;

	useEffect(() => {
		if (country === '') {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/305 現在地からGepoint取得 
			setAddress({
				country: '日本',
				administrativeAreaLevel1: '神奈川県',
				administrativeAreaLevel2: '',
				locality: '横浜市',
			});
		} else {
			setAddress({ country, administrativeAreaLevel1, administrativeAreaLevel2, locality });
		}
	}, [country, administrativeAreaLevel1, administrativeAreaLevel2, locality]);

	if (isFirstLoading) {
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
