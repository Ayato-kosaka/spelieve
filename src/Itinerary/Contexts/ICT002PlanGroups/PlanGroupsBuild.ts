import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';

import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';

/**
 * Export build function of initial ICT002PlanGroups.
 */
export const ICT002PlanGroupsBuild = (): ICT002PlanGroupsInterface => ({
	plans: [],
	representativePlanID: '',
	representativeStartTime: CHK001Utils.initialDate(),
});
