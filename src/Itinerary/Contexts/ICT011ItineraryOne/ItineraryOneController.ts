import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { ItineraryOneInterface } from './ItineraryOneIntereface';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import db from '@/Itinerary/Endpoint/firestore';

export const ICT011ItineraryOneController = () => {
	const itineraryCRef = useMemo(
		() =>
			collection(db, Itineraries.modelName).withConverter(
				FirestoreConverter<Itineraries, ItineraryOneInterface>(
					Itineraries,
					(data) => data,
					(data) => {
						Logger('IDB01/Itineraries', 'write', data);
						return data;
					},
				),
			),
		[],
	);
	return {
		itineraryCRef,
	};
};
