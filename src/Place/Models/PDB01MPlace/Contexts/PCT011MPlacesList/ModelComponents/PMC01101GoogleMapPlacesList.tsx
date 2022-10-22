import { useContext, useEffect } from "react";
import { View, Text } from "react-native"
import { PCT011MPlacesList } from "@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { PCT011MPlacesListValInterface } from "spelieve-common/lib/Interface";

export const PMC01101GoogleMapPlacesList = () => {

    const { placesList } = useContext(PCT011MPlacesList);

    return (
        <MapView
            style={{ width: '100%', height: 300 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
                latitude: 35.46606942124,
                longitude: 139.62261961841,
                latitudeDelta: 1.2522, // 地図表示範囲内の北端と南端の緯度の差 大→範囲広
                longitudeDelta: 0.0521, // 地図表示範囲内の東端と西端の経度の差
            }}
        >
            {placesList.map((place) => {
                const coordinate = { latitude: place.geometry.latitude, longitude: place.geometry.longitude };
                return (
                    <Marker
                        coordinate={coordinate}
                        title={place.name}
                        key={place.place_id}
                    />
                )
            })}
        </MapView>
    )
}