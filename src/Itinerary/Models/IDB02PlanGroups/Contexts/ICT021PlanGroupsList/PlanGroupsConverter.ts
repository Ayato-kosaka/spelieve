import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';

import { ICT021PlanGroupsListBuild } from './PlanGroupsBuild';
import { ICT021PlanGroupsListInterface } from './PlanGroupsInterface';

import { IDB002PlanGroupsInterface } from '@/Itinerary/Models/IDB002PlanGroups';

/**
 * Export a FirestoreDataConverter to transform ICT021PlanGroupsList into Firestore data.
 */
export const ICT021PlanGroupsListConverter = (): FirestoreDataConverter<ICT021PlanGroupsListInterface> => ({
	/**
	 * Convert ICT021PlanGroupsList before be saved to Firestore.
	 */
	toFirestore: (data: ICT021PlanGroupsListInterface): IDB002PlanGroupsInterface => ({
		plans: data.plans.join(),
		representativePlanID: data.representativePlanID,
		representativeStartTime: Timestamp.fromDate(data.representativeStartTime),
	}),

	/**
	 * Convert the data from Firestore to match ICT021PlanGroupsList.
	 */
	fromFirestore: (snapshot: QueryDocumentSnapshot<IDB002PlanGroupsInterface>): ICT021PlanGroupsListInterface => {
		const initData: ICT021PlanGroupsListInterface = ICT021PlanGroupsListBuild();
		return {
			plans: snapshot.data().plans.split(',') || initData.plans,
			representativePlanID: snapshot.data().representativePlanID || initData.representativePlanID,
			representativeStartTime: snapshot.data().representativeStartTime.toDate() || initData.representativeStartTime,
		};
	},
});
