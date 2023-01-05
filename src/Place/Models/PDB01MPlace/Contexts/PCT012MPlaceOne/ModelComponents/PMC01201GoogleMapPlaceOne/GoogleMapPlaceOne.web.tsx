import { GoogleMap, Marker as MarkerWeb } from '@react-google-maps/api';
import { useContext } from 'react';
import { View } from 'react-native';

import { GoogleMapPlaceOnePropsInterface } from 'spelieve-common/lib/Interfaces';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PMC01201GoogleMapPlaceOne = ({ style }: GoogleMapPlaceOnePropsInterface) => {
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/274 マップ範囲調整
	const { place } = useContext(PCT012MPlaceOne);

	if (!place) {
		return <View />;
	}
	const center = {
		lat: place.geometry.latitude,
		lng: place.geometry.longitude,
	};

	const coordinate = { lat: place.geometry.latitude, lng: place.geometry.longitude };
	return (
		<GoogleMap mapContainerStyle={style} center={center} zoom={10}>
			<MarkerWeb position={coordinate} title={place.name} key={place.place_id} />;
		</GoogleMap>
	);
};
