import React, { useContext } from 'react';

import {
	ICT011ItineraryOne,
	ICT011ItineraryOneProvider,
} from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

function InnerComponent1() {
	const useICT011ItineraryOne = useContext(ICT011ItineraryOne);
	return <ICT011ItineraryOneProvider id="id">aaa</ICT011ItineraryOneProvider>;
}

export function IPA001Itinerary() {
	const id = 'nzEQO5MhckDefM4MsAC7';

	return (
		<ICT011ItineraryOneProvider id={id}>
			<InnerComponent1 />
		</ICT011ItineraryOneProvider>
	);
}
