import { IDB002PlanGroupsInterface } from './PlanGroupsInterface';
import { PropsWithType } from '@/Common/Hooks/CHK003TypeScript';

/**
 * Export Object of column names of IDB002PlanGroups collection.
 */
export const IDB002PlanGroupsCols: PropsWithType<IDB002PlanGroupsInterface, string> = {
    plans: 'plans',
    representativePlanID: 'representativePlanID',
    representativeStartTime: 'representativeStartTime',
}