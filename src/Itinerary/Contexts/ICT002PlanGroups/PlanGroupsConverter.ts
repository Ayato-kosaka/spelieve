import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';

import { ICT002PlanGroupsBuild } from './PlanGroupsBuild';
import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';

import { IDB002PlanGroupsInterface } from '@/Itinerary/Models/IDB002PlanGroups';

/**
 * Export a FirestoreDataConverter to transform ICT002PlanGroups into Firestore data.
 */
export const ICT002PlanGroupsConverter = (): FirestoreDataConverter<ICT002PlanGroupsInterface> => ({
	/**
	 * Convert ICT002PlanGroups before be saved to Firestore.
	 */
	toFirestore: (data: ICT002PlanGroupsInterface): IDB002PlanGroupsInterface => ({
		plans: data.plans.join(),
		representativePlanID: data.representativePlanID,
		representativeStartTime: Timestamp.fromDate(data.representativeStartTime),
	}),

	/**
	 * Convert the data from Firestore to match ICT002PlanGroups.
	 */
	fromFirestore: (snapshot: QueryDocumentSnapshot<IDB002PlanGroupsInterface>): ICT002PlanGroupsInterface => {
		const initData: ICT002PlanGroupsInterface = ICT002PlanGroupsBuild();
		return {
			plans: snapshot.data().plans.split(',') || initData.plans,
			representativePlanID: snapshot.data().representativePlanID || initData.representativePlanID,
			representativeStartTime: snapshot.data().representativeStartTime.toDate() || initData.representativeStartTime,
		};
	},
});
