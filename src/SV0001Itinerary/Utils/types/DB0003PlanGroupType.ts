import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

export type DB0003PlanGroupType = {
    id: string;
    itineraryId: string;
    plans: Array<string>;
    representativePlanId: string;
    representativeStartTime: Date;
};

export const initPlanGroup = (id: string, itineraryId: string): DB0003PlanGroupType => {
    const planGroup: DB0003PlanGroupType = {
        id: id,
        itineraryId: itineraryId,
        plans: [],
        representativePlanId: '',
        representativeStartTime: HK0001Utils.initialDate(),
    };
    return planGroup;
}