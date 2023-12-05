import {
	TransitMode,
	TravelMode,
	TransitRoutingPreference,
	TravelRestriction,
} from '@googlemaps/google-maps-services-js';
import { collection, DocumentReference } from 'firebase/firestore';
import { useCallback } from 'react';

import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { PlansMapInterface } from './PlansMapInterface';

import {
	transitModeConverter,
	travelModeConverter,
	travelRestrictionConverter,
} from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const ICT031PlansMapController = () => {
	const getPlansCRef = useCallback(
		(itineraryDocumentReference: DocumentReference<Itineraries>) =>
			collection(itineraryDocumentReference, Plans.modelName).withConverter(
				FirestoreConverter<Plans, PlansMapInterface>(
					Plans,
					(data) => ({
						...data,
						transportationMode: (Object.keys(travelModeConverter) as TravelMode[]).find(
							(travelMode) => travelMode === data.transportationMode,
						),
						transitModes: data.transitModes
							.map((e) => (Object.keys(transitModeConverter) as TransitMode[]).find((item) => e === item))
							.filter((item): item is TransitMode => item !== undefined),
						transitRoutingPreference:
							[TransitRoutingPreference.fewer_transfers, TransitRoutingPreference.less_walking].find(
								(transitRoutingPreference) => transitRoutingPreference === data.transitRoutingPreference,
							) || TransitRoutingPreference.fewer_transfers,
						avoid: data.avoid
							.map((e) => (Object.keys(travelRestrictionConverter) as TravelRestriction[]).find((item) => e === item))
							.filter((item): item is TravelRestriction => item !== undefined),
					}),
					(data) => data,
				),
			),
		[],
	);

	return { getPlansCRef };
};
