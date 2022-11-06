import { GoogleMap, LoadScript, Marker as MarkerWeb } from '@react-google-maps/api';
import { useContext, useState } from 'react';
import { Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { stylesWeb, stylesNative } from './GoogleMapPlacesListStyle';

import { ENV } from '@/ENV';
import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export const PMC01101GoogleMapPlacesList = () => {
	const { placesList } = useContext(PCT011MPlacesList);
	const [ref, setRef] = useState<MapView | null>(null);

	const center = placesList[0];
	const centerLat = center ? center.geometry.latitude : 35.6809591;
	const centerLng = center ? center.geometry.longitude : 139.7673068;

	if (Platform.OS === 'web') {
		console.log('webが読み込まれた');

		const centerPoint = {
			lat: centerLat,
			lng: centerLng,
		};
		return (
			<GoogleMap mapContainerStyle={stylesWeb.containerStyle} center={centerPoint} zoom={10}>
				{placesList.map((place) => {
					const coordinate = { lat: place.geometry.latitude, lng: place.geometry.longitude };
					return <MarkerWeb position={coordinate} title={place.name} key={place.place_id} />;
				})}
			</GoogleMap>
		);
	}
	return (
		<MapView
			style={stylesNative.mapview}
			provider={PROVIDER_GOOGLE}
			ref={(r) => setRef(r)}
			initialRegion={{
				latitude: centerLat,
				longitude: centerLng,
				latitudeDelta: 0.2522, // 地図表示範囲内の北端と南端の緯度の差 大→範囲広
				longitudeDelta: 0.0521, // 地図表示範囲内の東端と西端の経度の差
			}}
			region={{
				latitude: centerLat,
				longitude: centerLng,
				latitudeDelta: 0.2522, // 地図表示範囲内の北端と南端の緯度の差 大→範囲広
				longitudeDelta: 0.0521, // 地図表示範囲内の東端と西端の経度の差
			}}>
			{placesList.map((place) => {
				const coordinate = { latitude: place.geometry.latitude, longitude: place.geometry.longitude };
				return <Marker coordinate={coordinate} title={place.name} key={place.place_id} />;
			})}
		</MapView>
	);
};
