import { IDB002PlanGroupsInterface } from '@/Itinerary/Models/IDB002PlanGroups';
import { Weaken } from '@/Common/Hooks/CHK003TypeScript';

/**
 * Export interface of ICT002PlanGroups object.
 */
export interface ICT002PlanGroupsInterface extends Weaken<IDB002PlanGroupsInterface, 'representativeStartTime'> {
    representativeStartTime: Date,
} 