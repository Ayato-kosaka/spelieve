import { useContext, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export function PMC01101GoogleMapPlacesList() {
	const { placesList } = useContext(PCT011MPlacesList);
	const [ref, setRef] = useState<MapView | null>(null);

	const center = placesList[0];
	const centerLat = center ? center.geometry.latitude : 35.6809591;
	const centerLng = center ? center.geometry.longitude : 139.7673068;

	// useEffect(() => {
	// 	ref?.fitToSuppliedMarkers(placesList.map((p) => p.place_id))
	// },[placesList])

	return (
		<MapView
			style={{ width: '100%', height: 200 }}
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
}
