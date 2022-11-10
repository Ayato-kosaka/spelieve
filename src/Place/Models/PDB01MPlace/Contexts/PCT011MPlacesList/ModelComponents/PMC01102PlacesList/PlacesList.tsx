import React, { FC, useContext } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

import { styles } from './PlacesListStyle';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { PlacesListPropsInterface, PlacesPropsInterface } from 'spelieve-common/lib/Interfaces';

export const PMC01102PlacesList = ({ onPlaceSelected }: PlacesListPropsInterface) => {
	const { placesList, retrieveMore } = useContext(PCT011MPlacesList);

	return (
		<View style={styles.list}>
			<FlatList
				data={placesList}
				renderItem={(itemData) => (
					<View>
						<TouchableOpacity
							onPress={() => onPlaceSelected(itemData.item.place_id)}>
							<Image source={{ uri: itemData.item.imageUrl }} style={styles.image} />
							<Text style={styles.placeName}>{itemData.item.name}</Text>
						</TouchableOpacity>
					</View>
				)}
				numColumns={2}
				onEndReached={retrieveMore}
				onEndReachedThreshold={0}
				keyExtractor={(place) => place.place_id}
			/>
		</View>
	);
};
