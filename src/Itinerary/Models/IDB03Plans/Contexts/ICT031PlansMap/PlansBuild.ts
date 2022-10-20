import { ICT031PlansMapInterface } from './PlansInterface';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';

/**
 * Export build function of initial ICT031PlansMap.
 */
export const ICT031PlansMapBuild = (): ICT031PlansMapInterface => ({
    title: '',
    span: CHK001Utils.initialDate(),
    startTime: CHK001Utils.initialDate(),
})