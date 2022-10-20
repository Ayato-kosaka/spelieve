import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';

/**
 * Export a FirestoreDataConverter to transform ICT011ItineraryOne into Firestore data.
 */
export const ICT011ItineraryOneConverter = (): FirestoreDataConverter<ItineraryOneInterface> => ({
	/**
	 * Convert ICT011ItineraryOne before be saved to Firestore.
	 */
	toFirestore: (data: ItineraryOneInterface): Itineraries => ({
		...data,
		startDate: data.startDate ? Timestamp.fromDate(data.startDate) : undefined,
		endDate: data.endDate ? Timestamp.fromDate(data.endDate) : undefined,
	}),

	/**
	 * Convert the data from Firestore to match ICT011ItineraryOne.
	 */
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ItineraryOneInterface => {
		const json = snapshot.data(options)!;
		// const itinerary = new Itineraries();
		// itinerary.title = (typeof json.title === 'string') ? json.title : '';
		// itinerary.caption = (typeof json.caption === 'string') ? json.caption : '';
		// itinerary.tags = (itinerary.tags instanceof Array) ? itinerary.tags : undefined;

		return {
			...(json as Itineraries),
			startDate: json.startDate ? (json.startDate as Timestamp).toDate() : undefined,
			endDate: json.endDate ? (json.endDate as Timestamp).toDate() : undefined,
		};
	},
});
