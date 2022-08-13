import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

export type DB0003PlanGroupsType = {
    readonly id: string;
    readonly itineraryID: string;
    plans: string;
    representativePlanID: string;
    representativeStartTime: Date;
};

export const initPlanGroup = (id: string, itineraryID: string): DB0003PlanGroupsType => {
    const planGroup: DB0003PlanGroupsType = {
        id: id,
        itineraryID: itineraryID,
        plans: '',
        representativePlanID: '',
        representativeStartTime: HK0001Utils.initialDate(),
    };
    return planGroup;
}