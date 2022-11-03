import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Text, ActivityIndicator } from 'react-native-paper';

import { BottomTabParamList } from '@/App';
import { PMC01201GoogleMapPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01201GoogleMapPlaceOne';
import { PMC01203PlaceImage } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/ModelComponents/PMC01203PlaceImage';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PPA002Place = ({ route, navigation }: NativeStackScreenProps<BottomTabParamList, 'PPA002Place'>) => {
	const { place } = useContext(PCT012MPlaceOne);
	const { place_id, language } = route.params;

	if (!place) {
		return <ActivityIndicator animating />;
	}
	return (
		<>
			<Text>PPA002画面</Text>
			<PMC01201GoogleMapPlaceOne />
			<PMC01203PlaceImage />
		</>
	);
};
