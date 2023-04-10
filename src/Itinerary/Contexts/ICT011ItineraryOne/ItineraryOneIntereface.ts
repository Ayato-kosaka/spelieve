import { DocumentSnapshot, CollectionReference } from 'firebase/firestore';

import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';

export type ItineraryOneInterface = Itineraries;

export interface ItineraryOneValInterface {
	itineraryDocSnap?: DocumentSnapshot<ItineraryOneInterface>;
	setItineraryID: React.Dispatch<React.SetStateAction<string | undefined>>;
	itineraryCRef: CollectionReference<ItineraryOneInterface>;
}
