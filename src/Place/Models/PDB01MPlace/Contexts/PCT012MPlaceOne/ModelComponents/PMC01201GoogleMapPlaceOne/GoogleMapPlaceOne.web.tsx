import { GoogleMap, Marker as MarkerWeb } from '@react-google-maps/api';
import { useContext } from 'react';

import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne/MPlaceOne';
import { styles } from './GoogleMapPlaceOneStyle.web';

export const PMC01201GoogleMapPlaceOne = () => {
	const { place } = useContext(PCT012MPlaceOne);

    const center = {
        lat: place.geometry.latitude,
        lng: place.geometry.longitude,
    };

    const coordinate = { lat: place.geometry.latitude, lng: place.geometry.longitude };
    return (
        <GoogleMap mapContainerStyle={styles.containerStyle} center={center} zoom={10}>
            <MarkerWeb position={coordinate} title={place.name} key={place.place_id} />;
        </GoogleMap>
    );
};
