import { useContext, useMemo } from 'react';

import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';

export const INV002ItineraryTopTabNavigatorController = ({
	route,
	navigation,
}: ItineraryStackScreenProps<'ItineraryTopTabNavigator'>) => {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const itinerary = useMemo(() => itineraryDocSnap?.data(), [itineraryDocSnap]);

	return { itinerary };
};
