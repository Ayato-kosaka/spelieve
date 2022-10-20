import { ICT021PlanGroupsListInterface } from './PlanGroupsInterface';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';

/**
 * Export build function of initial ICT021PlanGroupsList.
 */
export const ICT021PlanGroupsListBuild = (): ICT021PlanGroupsListInterface => ({
    plans: [],
    representativePlanID: '',
    representativeStartTime: CHK001Utils.initialDate(),
})