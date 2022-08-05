import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

export type DB0003PlanGroupType = {
    id: string;
    itineraryID: string;
    plans: Array<string>;
    representativePlanID: string;
    representativeStartTime: Date;
};

export const initPlanGroup = (id: string, itineraryID: string): DB0003PlanGroupType => {
    const planGroup: DB0003PlanGroupType = {
        id: id,
        itineraryID: itineraryID,
        plans: [],
        representativePlanID: '',
        representativeStartTime: HK0001Utils.initialDate(),
    };
    return planGroup;
}