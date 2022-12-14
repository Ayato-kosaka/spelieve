import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { addDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect } from 'react';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

export const IPA001ItineraryEditController = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA001ItineraryEdit'>) => {
	const { setItineraryID, itineraryCRef } = useContext(ICT011ItineraryOne);

	const { itineraryID } = route.params;

	const createItinerary = useCallback(async () => {
		if (itineraryCRef) {
			const itineray = await addDoc(itineraryCRef, {
				title: '',
				startDate: new Date(),
				tags: [],
				caption: '',
				isUpdatable: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			navigation.setParams({ itineraryID: itineray.id });
		}
	}, [itineraryCRef, navigation]);

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			createItinerary();
		}
	}, [createItinerary, itineraryID, setItineraryID]);

	return {
		createItinerary,
	};
};
