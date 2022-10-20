import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore';

import { PlansMapInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { Plans } from 'spelieve-common/lib/Models/Itinerary/IDB03/Plans';

/**
 * Export a FirestoreDataConverter to transform ICT031PlansMap into Firestore data.
 */
export const ICT031PlansMapConverter = (): FirestoreDataConverter<PlansMapInterface> => ({
	/**
	 * Convert ICT031PlansMap before be saved to Firestore.
	 */
	toFirestore: (data: PlansMapInterface): Plans => ({
		...data,
		placeSpan: Timestamp.fromDate(data.placeSpan),
		placeStartTime: Timestamp.fromDate(data.placeStartTime),
		placeEndTime: Timestamp.fromDate(data.placeEndTime),
		transportationSpan: Timestamp.fromDate(data.transportationSpan),
		transportationDepartureTime: data.transportationDepartureTime
			? Timestamp.fromDate(data.transportationDepartureTime)
			: undefined,
		transportationArrivalTime: data.transportationArrivalTime
			? Timestamp.fromDate(data.transportationArrivalTime)
			: undefined,
	}),

	/**
	 * Convert the data from Firestore to match ICT031PlansMap.
	 */
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlansMapInterface => {
		const json = snapshot.data(options)!;
		return {
			...(json as Plans),
			placeSpan: (json.placeSpan as Timestamp).toDate(),
			placeStartTime: (json.placeStartTime as Timestamp).toDate(),
			placeEndTime: (json.placeEndTime as Timestamp).toDate(),
			transportationSpan: (json.transportationSpan as Timestamp).toDate(),
			transportationDepartureTime: json.transportationDepartureTime
				? (json.transportationDepartureTime as Timestamp).toDate()
				: undefined,
			transportationArrivalTime: json.transportationArrivalTime
				? (json.transportationArrivalTime as Timestamp).toDate()
				: undefined,
		};
	},
});
