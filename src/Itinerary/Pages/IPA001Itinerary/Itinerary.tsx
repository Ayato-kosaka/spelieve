import React, { useContext } from 'react';

import {
	ICT011ItineraryOne,
	ICT011ItineraryOneProvider,
} from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsListProvider } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMapProvider } from '@/Itinerary/Models/IDB03Plans/Contexts/ICT031PlansMap';

function InnerComponent3() {
	// const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	// const useICT021PlanGroupsList = useContext(ICT021PlanGroupsList);
	// const useICT031PlansMap = useContext(ICT031PlansMap);
	// console.log("useICT011ItineraryOne", useICT011ItineraryOne.itineraryDocSnap.data())
	// console.log("useICT021PlanGroupsList", useICT021PlanGroupsList.planGroupsQSnap.docs.map(doc => doc.data()))
	// console.log("useICT031PlansMap", useICT031PlansMap.plansDocSnapMap)
	// return <></>;
}

function InnerComponent2() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	return (
		<ICT031PlansMapProvider parentDocRef={useICT011ItineraryOne.itineraryDocSnap.ref}>aaaa</ICT031PlansMapProvider>
	);
}

function InnerComponent1() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	return (
		<ICT021PlanGroupsListProvider parentDocRef={useICT011ItineraryOne.itineraryDocSnap.ref}>
			bbb
		</ICT021PlanGroupsListProvider>
	);
}

export function IPA001Itinerary() {
	const id = 'nzEQO5MhckDefM4MsAC7';
	return (
		<ICT011ItineraryOneProvider id={id}>
			<InnerComponent1 />
		</ICT011ItineraryOneProvider>
	);
}
