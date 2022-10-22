import React, { FC, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';


export const PMC01102PlacesList: FC = () => {
    const { placesList } = useContext(PCT011MPlacesList);

    const styles = StyleSheet.create({
        list: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: 10,
            width: '100%',
            alignSelf: "center",
            alignContentnItems: "flex-start",
        },
        image: {
            height: 200,
            width: 'auto',
            // marginHorizontal: 10,
        }
    });

    return (
        <View style={styles.list}>
            <FlatList
                data={placesList}
                renderItem={itemData => {
                    // const imageUrl = require(`${itemData.item.imageUrl}`);
                    return (
                        <View>
                            <Image source={{ uri: itemData.item.imageUrl}} style={styles.image} />
                            <Text style={{ color: 'black' }}>{itemData.item.name}</Text>
                        </View>
                    )
                }}
                numColumns={2}
            />
        </View>
    )


}
