import { Timestamp } from "firebase/firestore/dist/firestore";

/**
 * Export interface of IDB002PlanGroups collection.
 */
export interface IDB002PlanGroupsInterface {
    plans: string;
    representativePlanID: string;
    representativeStartTime: Timestamp;
};