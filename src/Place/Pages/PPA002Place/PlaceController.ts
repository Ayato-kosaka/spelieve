import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';

import { PlaceControllerInterface, PlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';
import { useContext, useEffect } from 'react';
import { PCT012MPlaceOne } from '@/Place/Models/PDB01MPlace/Contexts/PCT012MPlaceOne';

export const PPA002PlaceController = ({ place_id }: PlacePropsInterface): PlaceControllerInterface => {
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();
	const { place, setPlaceID } = useContext(PCT012MPlaceOne);

	useEffect(() => {
		setPlaceID(place_id);
	}, [place_id, setPlaceID]);

	const onCreateItineraryClicked = () => {
		// TODO: https://github.com/Ayato-kosaka/spelieve/issues/335 Itinerary 新規作成 
		// navigation.navigate('Itinerary', {
		// 	screen: 'ItineraryTopTabNavigator',
		// 	params: { place_id, placeName: place.name },
		// });
	};

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/320 画像押したらモーダルで開くようにする
	const onImageClicked = () => {};

	return { onCreateItineraryClicked, onImageClicked };
};
