import React, { useContext } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

import { PlacesListPropsInterface } from 'spelieve-common/lib/Interfaces';

import { styles } from './PlacesListStyle';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export const PMC01102PlacesList = ({ onPlaceSelected, style }: PlacesListPropsInterface) => {
	const { placesList, retrieveMore } = useContext(PCT011MPlacesList);

	return (
		<View style={style}>
			<FlatList
				data={placesList}
				renderItem={(itemData) => (
					<TouchableOpacity onPress={() => onPlaceSelected(itemData.item.place_id)} style={styles.item}>
						<Image source={{ uri: itemData.item.imageUrl }} style={styles.image} />
						<Text style={styles.placeName}>{itemData.item.name}</Text>
					</TouchableOpacity>
				)}
				numColumns={2}
				onEndReached={retrieveMore}
				onEndReachedThreshold={0.8}
				keyExtractor={(place) => place.place_id}
			/>
		</View>
	);
};
