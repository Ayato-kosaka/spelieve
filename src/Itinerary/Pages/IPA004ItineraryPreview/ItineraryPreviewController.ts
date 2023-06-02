import { useContext, useEffect, useMemo } from 'react';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces/Itinerary/ICT011';

import { ItineraryTopTabScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';
import { PlansMapInterface } from '@/Itinerary/Contexts/ICT031PlansMap/PlansMapInterface';

export const IPA004ItineraryPreviewController = ({
	route,
	navigation,
}: ItineraryTopTabScreenProps<'ItineraryPreview'>) => {
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const itinerary: ItineraryOneInterface | undefined = useMemo(() => itineraryDocSnap?.data(), [itineraryDocSnap]);

	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);
	const planGroups = useMemo(() => planGroupsQSnap?.docs?.map((doc) => doc.data()), [planGroupsQSnap]);
	const itineraryID = useMemo(() => itineraryDocSnap?.id, [itineraryDocSnap]);

	useEffect(() => {
		if (route.params.itineraryID) {
			if (!itineraryID) {
				setItineraryID(route.params.itineraryID);
			}
		} else if (itineraryID) {
			navigation.setParams({ itineraryID });
		} else {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/361 navigation.navigate が動かない
			navigation.navigate('HelloSpelieve', {});
		}
	}, [itineraryID, navigation, route.params.itineraryID, setItineraryID]);

	const { plansDocSnapMap, isPlansLoading } = useContext(ICT031PlansMap);
	const plans = useMemo(() => {
		const ret: { [id: string]: PlansMapInterface } = {};
		Object.keys(plansDocSnapMap).forEach((key) => {
			ret[key] = plansDocSnapMap[key].data();
		});
		return ret;
	}, [plansDocSnapMap]);

	const needToShowActivityIndicator = useMemo(
		() => !itinerary || !planGroups || isPlansLoading,
		[itinerary, planGroups, isPlansLoading],
	);

	return {
		itinerary: itinerary!,
		planGroups: planGroups!,
		plans,
		needToShowActivityIndicator,
	};
};
