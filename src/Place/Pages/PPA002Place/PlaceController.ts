import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useContext, useEffect } from 'react';

import { PlaceControllerInterface, PlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne';

export const PPA002PlaceController = ({ place_id }: PlacePropsInterface): PlaceControllerInterface => {
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();
	const { place, setPlaceID } = useContext(PCT012MPlaceOne);

	useEffect(() => {
		setPlaceID(place_id);
	}, [place_id, setPlaceID]);

	const onCreateItineraryClicked = () => {
		navigation.navigate('Itinerary', {
			screen: 'TopTab',
			params: {
				screen: 'ItineraryEdit',
				params: {
					itineraryID: undefined,
					place_id,
					placeName: place?.name,
					placeImage: place?.imageUrl,
				},
			},
		});
	};

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/320 画像押したらモーダルで開くようにする
	const onImageClicked = () => {};

	return { onCreateItineraryClicked, onImageClicked };
};
