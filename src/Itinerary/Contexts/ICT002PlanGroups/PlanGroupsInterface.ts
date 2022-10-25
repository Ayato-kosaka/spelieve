import { Weaken } from '@/Common/Hooks/CHK003TypeScript';
import { IDB002PlanGroupsInterface } from '@/Itinerary/Models/IDB002PlanGroups';

/**
 * Export interface of ICT002PlanGroups object.
 */
export interface ICT002PlanGroupsInterface
	extends Weaken<IDB002PlanGroupsInterface, 'representativeStartTime' | 'plans'> {
	representativeStartTime: Date;
	plans: Array<string>;
}
