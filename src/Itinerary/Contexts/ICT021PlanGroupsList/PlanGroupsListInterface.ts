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
	swapPlanOrder: (
		index1: {
			planGroup: number;
			plan: number;
		},
		index2: {
			planGroup: number;
			plan: number;
		},
	) => Promise<void>;
}
