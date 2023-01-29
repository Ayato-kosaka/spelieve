import { QueryDocumentSnapshot } from 'firebase/firestore';

import { PlanGroupsListInterface } from 'spelieve-common/lib/Interfaces';

export interface PlanGroupsEditPropsInterface {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	onPlanPress: (planGroupID: string, planID: string) => void;
}
