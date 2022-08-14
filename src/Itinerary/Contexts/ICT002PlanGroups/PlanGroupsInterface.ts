import { IDB002PlanGroupsInterface } from '@/Itinerary/Interfaces/IDB002PlanGroupsInterface'
import { Weaken } from '@/Common/Hooks/CHK003TypeScript'

export interface ICT002PlanGroupsInterface extends Weaken<IDB002PlanGroupsInterface, 'plans'> {
    plans: Array<string>;
};