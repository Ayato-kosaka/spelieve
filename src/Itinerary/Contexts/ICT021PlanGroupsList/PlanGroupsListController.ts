import { collection, DocumentSnapshot } from 'firebase/firestore';
import { useMemo } from 'react';

import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';
import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import { PlanGroupsListInterface } from './PlanGroupsListInterface';

export const ICT021PlanGroupsListController = (itineraryDocSnap: DocumentSnapshot<Itineraries> | undefined) => {
	const planGroupsCRef = useMemo(() => {
		if (itineraryDocSnap) {
			return collection(itineraryDocSnap.ref, PlanGroups.modelName).withConverter(
				FirestoreConverter<PlanGroups, PlanGroupsListInterface>(
					PlanGroups,
					(data) => ({
						...data,
						dayNumber: Math.floor(
							(data.representativeStartDateTime.getTime() - (itineraryDocSnap.data()?.startDate?.getTime() || 0)) /
								(1000 * 60 * 60 * 24) +
								1,
						),
					}),
					(data) => ({
						...data,
						dayNumber: undefined,
					}),
				),
			);
		}
		return undefined;
	}, [itineraryDocSnap]);

	return { planGroupsCRef };
};
