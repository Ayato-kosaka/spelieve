import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { CollectionReference, QueryDocumentSnapshot } from 'firebase/firestore';

import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';

export interface PlansMapInterface extends Plans {
	transportationMode?: TravelMode;
	transitModes: TransitMode[];
	transitRoutingPreference: TransitRoutingPreference;
	avoid: TravelRestriction[];
}

export interface PlansMapValInterface {
	plansDocSnapMap: {
		[id: string]: QueryDocumentSnapshot<PlansMapInterface>;
	};
	plansCRef?: CollectionReference<PlansMapInterface>;
	isPlansLoading: boolean;
}
