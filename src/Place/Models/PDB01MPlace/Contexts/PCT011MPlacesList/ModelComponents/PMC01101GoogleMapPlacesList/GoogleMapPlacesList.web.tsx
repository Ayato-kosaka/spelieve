import { GoogleMap, Marker as MarkerWeb } from '@react-google-maps/api';
import { useContext } from 'react';

import { styles } from './GoogleMapPlacesListStyle.web';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { View } from 'react-native';
import { GoogleMapPlaceListPropsInterface } from 'spelieve-common/lib/Interfaces';

export const PMC01101GoogleMapPlacesList = ({ style }: GoogleMapPlaceListPropsInterface) => {
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/274 マップ範囲調整
	const { placesList } = useContext(PCT011MPlacesList);

	const center = placesList[0];
	const centerLat = center ? center.geometry.latitude : 35.6809591;
	const centerLng = center ? center.geometry.longitude : 139.7673068;

	const centerPoint = {
		lat: centerLat,
		lng: centerLng,
	};
	return (
		<View style={style}>
			<GoogleMap mapContainerStyle={styles.containerStyle} center={centerPoint} zoom={10}>
				{placesList.map((place) => {
					const coordinate = { lat: place.geometry.latitude, lng: place.geometry.longitude };
					return <MarkerWeb position={coordinate} title={place.name} key={place.place_id} />;
				})}
			</GoogleMap>
		</View>
	);
};
