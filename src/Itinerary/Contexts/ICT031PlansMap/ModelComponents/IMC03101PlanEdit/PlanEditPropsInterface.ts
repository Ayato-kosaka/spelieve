import { QueryDocumentSnapshot } from 'firebase/firestore';

import { PlanGroupsListInterface } from '@/Itinerary/Contexts/ICT021PlanGroupsList/PlanGroupsListInterface';

export interface PlanEditPropsInterface {
	planID: string;
	beforeAfterRepresentativeType: 'before' | 'representative' | 'after';
	planGroupsDoc: QueryDocumentSnapshot<PlanGroupsListInterface>;
	dependentPlanID: string;
	isPlanGroupMounted: boolean;
	onPlanPress: (planGroupID: string, planID: string) => void;
}
