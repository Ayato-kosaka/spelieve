import { useContext } from 'react';
import { Image, View } from 'react-native';

import { styles } from './PlaceImageStyle';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PMC01203PlaceImage = () => {
	const { place } = useContext(PCT012MPlaceOne);

	if (!place) {
		return <View />;
	}
	return <Image source={{ uri: place.imageUrl }} style={styles.image} />;
};
