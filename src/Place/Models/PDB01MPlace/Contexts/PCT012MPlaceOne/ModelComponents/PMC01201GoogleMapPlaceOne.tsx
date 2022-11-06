import { useContext } from 'react';
import { Platform } from 'react-native';
import { LoadScript, GoogleMap, Marker as MarkerWeb } from '@react-google-maps/api';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ENV } from '@/ENV';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PMC01201GoogleMapPlaceOne = () => {
	const { place } = useContext(PCT012MPlaceOne);

	if (Platform.OS == 'web') {
		const containerStyle = {
			height: "300px",
			width: "100%",
		};

		const centerPoint = {
			lat: place.geometry.latitude,
			lng: place.geometry.longitude,
		};
		const coordinate = { lat: place.geometry.latitude, lng: place.geometry.longitude };
		return (
			
				<GoogleMap mapContainerStyle={containerStyle} center={centerPoint} zoom={10}>
					<MarkerWeb position={coordinate} title={place.name} key={place.place_id} />;
				</GoogleMap>
			
		);
	} else {
		const coordinate = { latitude: place.geometry.latitude, longitude: place.geometry.longitude };
		return (
			<MapView
				style={{ width: '100%', height: 200 }}
				provider={PROVIDER_GOOGLE}
				initialRegion={{
					latitude: coordinate.latitude,
					longitude: coordinate.longitude,
					latitudeDelta: 0.0062, // 地図表示範囲内の北端と南端の緯度の差 大→範囲広
					longitudeDelta: 0.0062, // 地図表示範囲内の東端と西端の経度の差
				}}>
				<Marker coordinate={coordinate} title={place.name} key={place.place_id} />
			</MapView>
		);
	}
};
