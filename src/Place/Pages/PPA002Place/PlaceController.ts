import { useContext, useEffect } from 'react';

import { PlaceControllerInterface } from 'spelieve-common/lib/Interfaces';

import { PlaceStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { PCT012MPlaceOne } from '@/Place/Contexts/PCT012MPlaceOne';

export const PPA002PlaceController = ({
	route,
	navigation,
}: PlaceStackScreenProps<'PPA002Place'>): PlaceControllerInterface => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { place_id } = route.params;
	const { place, setPlaceID } = useContext(PCT012MPlaceOne);

	useEffect(() => {
		setPlaceID(place_id);
	}, [place_id, setPlaceID]);

	const onCreateItineraryClicked = () => {
		navigation.navigate('Itinerary', {
			screen: 'ItineraryTopTabNavigator',
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
