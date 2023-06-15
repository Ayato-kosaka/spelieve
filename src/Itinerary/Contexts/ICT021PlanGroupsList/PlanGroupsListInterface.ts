import { CollectionReference, QuerySnapshot } from 'firebase/firestore';

import { PlanGroups } from 'spelieve-common/lib/Models/Itinerary/IDB02/PlanGroups';

import { PlansMapInterface } from '../ICT031PlansMap/PlansMapInterface';

export interface PlanGroupsListInterface extends Omit<PlanGroups, 'ver'> {
	dayNumber: number;
}

export interface PlanGroupsListValInterface {
	planGroupsQSnap?: QuerySnapshot<PlanGroupsListInterface>;
	planGroupsCRef?: CollectionReference<PlanGroupsListInterface>;
	createPlanGroup: (plan?: Partial<PlansMapInterface>) => Promise<void>;
	movePlan: (
		from: {
			planGroupIndex: number;
			planIndex: number;
		},
		to: {
			planGroupIndex: number;
			planIndex: number;
		},
	) => Promise<void>;
}
