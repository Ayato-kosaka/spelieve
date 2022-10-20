import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';

/**
 * Export a FirestoreDataConverter to transform ICT021PlanGroupsList into Firestore data.
 */
export const ICT021PlanGroupsListConverter = (): FirestoreDataConverter<PlanGroupsListInterface> => ({
	/**
	 * Convert ICT021PlanGroupsList before be saved to Firestore.
	 */
	toFirestore: (data: PlanGroupsListInterface): PlanGroups => ({
		...data,
		representativeStartTime: Timestamp.fromDate(data.representativeStartTime),
	}),

	/**
	 * Convert the data from Firestore to match ICT021PlanGroupsList.
	 */
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PlanGroupsListInterface => {
		const json = snapshot.data(options)!;
		return {
			...(json as PlanGroups),
			representativeStartTime: (json.representativeStartTime as Timestamp).toDate(),
		};
	},
});
