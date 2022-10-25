import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';

import { ICT003PlansBuild } from './PlansBuild';
import { ICT003PlansInterface } from './PlansInterface';

import { IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans';

/**
 * Export a FirestoreDataConverter to transform ICT003Plans into Firestore data.
 */
export const ICT003PlansConverter = (): FirestoreDataConverter<ICT003PlansInterface> => ({
	/**
	 * Convert ICT003Plans before be saved to Firestore.
	 */
	toFirestore: (data: ICT003PlansInterface): IDB003PlansInterface => ({
		title: data.title,
		span: Timestamp.fromDate(data.span),
	}),

	/**
	 * Convert the data from Firestore to match ICT003Plans.
	 */
	fromFirestore: (snapshot: QueryDocumentSnapshot<IDB003PlansInterface>): ICT003PlansInterface => {
		const initData: ICT003PlansInterface = ICT003PlansBuild();
		return {
			title: snapshot.data().title || initData.title,
			span: snapshot.data().span.toDate() || initData.span,
			startTime: initData.startTime,
		};
	},
});
