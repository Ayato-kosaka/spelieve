import { QueryDocumentSnapshot } from 'firebase/firestore';

import { PlanGroupsListInterface } from '@/Itinerary/Contexts/ICT021PlanGroupsList/PlanGroupsListInterface';

export interface PlanGroupsEditPropsInterface {
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	onPlanPress: (planGroupID: string, planID: string) => void;
}
