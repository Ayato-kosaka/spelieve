import { ICT003PlansInterface } from './PlansInterface';
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils';

/**
 * Export build function of initial ICT003Plans.
 */
export const ICT003PlansBuild = (): ICT003PlansInterface => ({
    title: '',
    span: CHK001Utils.initialDate(),
})