import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

export type DB0004PlanType = {
    id: string;
    itineraryId: string;
    title: string;
    span: Date;
};

export const initPlan = (id: string, itineraryId: string): DB0004PlanType => {
    const plan: DB0004PlanType = {
        id: id,
        itineraryId: itineraryId,
        title: '',
        span: HK0001Utils.initialDate(),
    };
    return plan;
}