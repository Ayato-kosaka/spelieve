import React, { FC, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Button, TouchableOpacity } from 'react-native';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { useNavigation } from "@react-navigation/native";

export const PMC01102PlacesList: FC = () => {
    const { placesList } = useContext(PCT011MPlacesList);
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        list: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            position: 'absolute',
            top: '42%',
            // marginHorizontal: 10,
            zIndex: -1,
            width: '100%',
            // alignSelf: "center",
            // alignContentnItems: "flex-start",
        },
        image: {
            height: 200,
            width: 215,
            // marginHorizontal: 10,
        },
        placeName: {
            position: 'absolute',
            top: 0,
            left: 0,
            color: 'black',
            backgroundColor: 'darkgrey'
            
        }
    });

    return (
        <View style={styles.list}>
            <FlatList
                data={placesList}
                renderItem={itemData => (
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('PPA002Place')}>
                                <Image source={{ uri: itemData.item.photoUrls[0] }} style={styles.image} />
                                <Text style={styles.placeName}>{itemData.item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                numColumns={2}
            />
        </View>
    )
}
