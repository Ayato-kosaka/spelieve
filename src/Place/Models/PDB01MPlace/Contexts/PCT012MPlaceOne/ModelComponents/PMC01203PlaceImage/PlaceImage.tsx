import { useContext } from 'react';
import { Image, StyleSheet } from 'react-native';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';
import { styles } from './PlaceImageStyle'

export const PMC01203PlaceImage = () => {
	const { place } = useContext(PCT012MPlaceOne);

	if (place) {
		return <Image source={{ uri: place.imageUrl }} style={styles.image} />;
	} else {
		return <></>
	}
};
