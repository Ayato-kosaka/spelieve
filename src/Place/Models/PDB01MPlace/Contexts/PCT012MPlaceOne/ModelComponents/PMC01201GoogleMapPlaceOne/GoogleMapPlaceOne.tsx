import { useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { styles } from './GoogleMapPlaceOneStyle';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';

export const PMC01201GoogleMapPlaceOne = () => {
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/274 マップ範囲調整
	const { place } = useContext(PCT012MPlaceOne);

	const coordinate = { latitude: place.geometry.latitude, longitude: place.geometry.longitude };
	return (
		<MapView
			style={styles.mapview}
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
};
