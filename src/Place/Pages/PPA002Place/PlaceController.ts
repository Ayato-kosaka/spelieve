import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';

import { PlaceControllerInterface, PlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';

export const PPA002PlaceController = ({ place_id }: PlacePropsInterface): PlaceControllerInterface => {
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

	const onCreateItineraryClicked = (placeName: string) => {
		// TODO: https://github.com/Ayato-kosaka/spelieve/issues/335 Itinerary 新規作成 
		// navigation.navigate('Itinerary', {
		// 	screen: 'ItineraryTopTabNavigator',
		// 	params: { place_id, placeName },
		// });
	};

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/320 画像押したらモーダルで開くようにする
	const onImageClicked = () => {};

	return { onCreateItineraryClicked, onImageClicked };
};
