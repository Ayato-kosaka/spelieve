import { useContext, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { GoogleMapPlaceListPropsInterface } from './GoogleMapPlaceListInterface';
import { styles } from './GoogleMapPlacesListStyle';

import { PCT011MPlacesList } from '@/Place/Contexts/PCT011MPlacesList';

export const PMC01101GoogleMapPlacesList = ({ style }: GoogleMapPlaceListPropsInterface) => {
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/274 マップ範囲調整
	const { placesList } = useContext(PCT011MPlacesList);
	const [ref, setRef] = useState<MapView | null>(null);

	const center = placesList[0];
	const centerLat = center ? center.geometry.latitude : 35.6809591;
	const centerLng = center ? center.geometry.longitude : 139.7673068;

	return (
		<View style={style}>
			<MapView
				style={styles.mapview}
				provider={PROVIDER_GOOGLE}
				ref={(r) => setRef(r)}
				initialRegion={{
					latitude: centerLat,
					longitude: centerLng,
					latitudeDelta: 0.007, // 地図表示範囲内の北端と南端の緯度の差 大→範囲広
					longitudeDelta: 0.005, // 地図表示範囲内の東端と西端の経度の差
				}}
				region={{
					latitude: centerLat,
					longitude: centerLng,
					latitudeDelta: 0.007, // 地図表示範囲内の北端と南端の緯度の差 大→範囲広
					longitudeDelta: 0.005, // 地図表示範囲内の東端と西端の経度の差
				}}>
				{placesList.map((place) => {
					const coordinate = { latitude: place.geometry.latitude, longitude: place.geometry.longitude };
					return <Marker coordinate={coordinate} title={place.name} key={place.place_id} />;
				})}
			</MapView>
		</View>
	);
};
