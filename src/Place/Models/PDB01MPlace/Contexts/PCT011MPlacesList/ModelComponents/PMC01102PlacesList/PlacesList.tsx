import { useNavigation } from '@react-navigation/native';
import React, { FC, useContext } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

import { styles } from './PlacesListStyle';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';


export const PMC01102PlacesList: FC = () => {
	const { placesList, retrieveMore } = useContext(PCT011MPlacesList);
	const navigation = useNavigation();

	return (
		<View style={styles.list}>
			<FlatList
				data={placesList}
				renderItem={(itemData) => (
					<View>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate('PPA002Place', {
									place_id: itemData.item.place_id,
									language: 'ja',
								})
							}>
							<Image source={{ uri: itemData.item.photoUrls[0] }} style={styles.image} />
							<Text style={styles.placeName}>{itemData.item.name}</Text>
						</TouchableOpacity>
					</View>
				)}
				numColumns={2}
				onEndReached={retrieveMore}
				onEndReachedThreshold={0}
				keyExtractor={place => place.place_id}
			/>
		</View>
	);
};
