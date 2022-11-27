import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useContext, useMemo } from 'react';

import { ItineraryPreviewControllerInterface } from 'spelieve-common/lib/Interfaces';
import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT011';
import { PlansMapInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT031';

import { BottomTabParamList } from '@/App';
import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

export const IPA004ItineraryPreviewController = ({
	route,
	navigation,
}: NativeStackScreenProps<BottomTabParamList, 'IPA004ItineraryPreview'>): ItineraryPreviewControllerInterface => {
	const { itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const itinerary: ItineraryOneInterface | undefined = useMemo(() => itineraryDocSnap?.data(), [itineraryDocSnap]);

	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const planGroups = useMemo(() => planGroupsQSnap?.docs?.map((doc) => doc.data()), [planGroupsQSnap]);

	const { itineraryID } = route.params;

	const { plansDocSnapMap, isPlansLoading } = useContext(ICT031PlansMap);
	const plans = useMemo(() => {
		const ret: { [id: string]: PlansMapInterface } = {};
		Object.keys(plansDocSnapMap).forEach((key) => {
			ret[key] = plansDocSnapMap[key].data();
		});
		return ret;
	}, [plansDocSnapMap]);

	const navigateToTop = useCallback(
		() =>
			navigation.navigate('Itinerary', {
				screen: 'HelloSpelieve',
				params: {},
			}),
		[navigation],
	);
	const needToNavigateToTop = useMemo(() => !itinerary && !itineraryID, [itinerary, itineraryID]);
	const needToShowActivityIndicator = useMemo(
		() => !itinerary || !planGroups || isPlansLoading,
		[itinerary, planGroups, isPlansLoading],
	);

	return {
		itinerary: itinerary!,
		planGroups: planGroups!,
		plans,
		navigateToTop,
		needToNavigateToTop,
		needToShowActivityIndicator,
	};
};
