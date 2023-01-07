import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useContext, useMemo } from 'react';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';

export const INV002ItineraryTopTabNavigatorController = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'TopTab'>) => {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const itinerary = useMemo(() => itineraryDocSnap?.data(), [itineraryDocSnap]);

	const onPressSetting = useCallback(() => {
		navigation.navigate('Itinerary', {
			screen: 'ItineraryCover',
			params: {
				itineraryID: itineraryDocSnap?.id,
			},
		});
	}, [itineraryDocSnap?.id, navigation]);

	return { itinerary, onPressSetting };
};
