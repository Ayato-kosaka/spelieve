import { Text, View, Modal, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { GeoPoint } from '@firebase/firestore-types'
import Slider from '@react-native-community/slider';
import { PCT011MPlacesListInterface, PDB01MPlaceOpeningHoursInterface } from 'spelieve-common/Interface';


export const PMC01102PlacesList = () => {
    // temporary data
    const placeList: Array<PCT011MPlacesListInterface> = [
        {   name: '横浜',
            imageUrl: 'aaa',
            instagramAPIID: 'aaa',
            geometry: new GeoPoint(0,0),
            geohash: 'aaa',
            mapUrl: 'aaa',
            website: undefined,
            address: 'aaa',
            phoneNumber: 'aaa',
            openingHours: new Date() as PDB01MPlaceOpeningHoursInterface,
            rating: 1,
            popularTags: undefined,
            averageStayTime: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        { 
            name: '東京駅',
            imageUrl: 'aaa',
            instagramAPIID: 'aaa',
            geometry: new GeoPoint(0,0),
            geohash: 'aaa',
            mapUrl: 'aaa',
            website: undefined,
            address: 'aaa',
            phoneNumber: 'aaa',
            openingHours: new Date() as PDB01MPlaceOpeningHoursInterface,
            rating: 1,
            popularTags: undefined,
            averageStayTime: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }, 
    ]

    // useEffect(() => {
    //     const fetchData = async () => {
            
    //     }
    //     fetchData();
    // }, []);

    return (
        <>
            <View>
                <Text>
                    絞り込み
                </Text>
            </View>
            <Modal>
                <Slider
                    value={0}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    // onValueChange={}
                />
            </Modal>
            <FlatList
                data={placeList}
                renderItem={({item}) => 
                    <View>
                        <ImageBackground source={item.imageUrl}>
                            <Text>{item.name}</Text>
                        </ImageBackground>
                    </View>
                }
            />
        </>
    )
}