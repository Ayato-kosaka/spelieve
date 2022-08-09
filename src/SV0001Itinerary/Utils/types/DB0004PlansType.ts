import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

export type DB0004PlansType = {
    readonly id: string;
    itineraryID: string;
    title: string;
    span: Date;
};

export const initPlan = (id: string, itineraryID: string): DB0004PlansType => {
    const plan: DB0004PlansType = {
        id: id,
        itineraryID: itineraryID,
        title: '',
        span: HK0001Utils.initialDate(),
    };
    return plan;
}