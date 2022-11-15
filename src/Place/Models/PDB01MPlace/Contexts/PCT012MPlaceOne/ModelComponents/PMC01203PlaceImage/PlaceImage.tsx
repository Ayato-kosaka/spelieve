import { useContext } from 'react';
import { Image, StyleSheet } from 'react-native';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PMC01203PlaceImage = () => {
	const { place } = useContext(PCT012MPlaceOne);

	const styles = StyleSheet.create({
		image: {
			height: 200,
			width: '100%',
			// marginHorizontal: 10,
		},
	});

	return <Image source={{ uri: place.imageUrl }} style={styles.image} />;
};
