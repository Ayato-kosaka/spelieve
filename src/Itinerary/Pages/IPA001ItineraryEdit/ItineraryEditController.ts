import { addDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect } from 'react';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import { ItineraryTopTabScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';

export const IPA001ItineraryEditController = ({ route, navigation }: ItineraryTopTabScreenProps<'ItineraryEdit'>) => {
	const { setItineraryID, itineraryCRef } = useContext(ICT011ItineraryOne);
	const { planGroupsQSnap, createPlanGroup, planGroupsCRef } = useContext(ICT021PlanGroupsList);
	const { plansCRef } = useContext(ICT031PlansMap);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { itineraryID, place_id, placeName, placeImage } = route.params;

	const createItinerary = useCallback(async () => {
		if (itineraryCRef) {
			Logger('IPA001ItineraryEditController', 'createItinerary', { itineraryCRef, plansCRef, planGroupsCRef });
			const itinerayDocRef = await addDoc(itineraryCRef, {
				startDate: ((d) => {
					d.setHours(0);
					d.setMinutes(0);
					d.setSeconds(0);
					return d;
				})(new Date()),
				textMap: {},
				storeUrlMap: {},
				caption: '',
				isUpdatable: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			navigation.setParams({ itineraryID: itinerayDocRef.id });
		}
	}, [itineraryCRef, navigation, planGroupsCRef, plansCRef]);

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			createItinerary();
		}
	}, [createItinerary, itineraryID, setItineraryID]);

	useEffect(() => {
		if (planGroupsQSnap?.empty) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			createPlanGroup({
				title: placeName || '',
				place_id,
				imageUrl: placeImage,
			});
		}
	}, [createPlanGroup, placeImage, placeName, place_id, planGroupsQSnap?.empty]);

	const onPlanPress = useCallback(
		(planGroupID: string, planID: string) => {
			navigation.navigate('EditPlan', {
				itineraryID,
				planGroupID,
				planID,
			});
		},
		[navigation, itineraryID],
	);

	return {
		onPlanPress,
	};
};
