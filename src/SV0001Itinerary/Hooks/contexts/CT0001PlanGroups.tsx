import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import * as DB0003PlanGroups from 'SV0001Itinerary/Utils/api/DB0003PlanGroups';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans';
import type { DB0002ItinerariesType } from 'SV0001Itinerary/Utils/types/DB0002ItinerariesType';
import type { DB0003PlanGroupsType } from 'SV0001Itinerary/Utils/types/DB0003PlanGroupsType'
import type { DB0004PlansType } from 'SV0001Itinerary/Utils/types/DB0004PlansType'

type CT0001PlanGroupsProviderProps = {
    itineraryID: DB0002ItinerariesType['id'];
    children:    ReactNode;
};

type FrontPlanGroupsType = Omit<DB0003PlanGroupsType, 'plans'> & { plans: Array<string> };

type CT0001PlanGroupsContextType = {
    planGroups:                 FrontPlanGroupsType[];
    createPlanGroup:            (representativeStartTime: Date) => Promise<void>;
    updatePlanGroup:            (index: number, planGroup: FrontPlanGroupsType) => Promise<void>;
    changeRepresentativePlanID: (index: number, planIndex: number)  => void;
    removePlan:                 (index: number, planIndex: number, isremoveFromPlanGroup: boolean) => void;
    deletePlan:                 (index: number, planIndex: number) => void;
    insertPlan:                 (index: number, planIndex: number, planID: DB0004PlansType['id']) => Promise<void>;
};

const CT0001PlanGroups = createContext<CT0001PlanGroupsContextType>({} as CT0001PlanGroupsContextType);
export default CT0001PlanGroups;

export const CT0001PlanGroupsProvider = (
    { itineraryID, children }: CT0001PlanGroupsProviderProps
) => {
    const [planGroups, setPlanGroups] = useState<FrontPlanGroupsType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { plans, ...useCT0002 } = useContext(CT0002Plans);

    useEffect(() => {
        const fetchData = async () => {
            const planGroups: DB0003PlanGroupsType[] = await DB0003PlanGroups.readAll(itineraryID);
            if (planGroups.length) {
                const frontPlanGroups: FrontPlanGroupsType[] = planGroups.map((planGroup) => {
                    return toFrontType(planGroup);
                }); 
                setPlanGroups(frontPlanGroups);
            } else {
                await createPlanGroup();
            }
            setIsLoading(false);
        }
        fetchData();
    }, [itineraryID]);

    const toFrontType = (planGroup: DB0003PlanGroupsType): FrontPlanGroupsType => {
        return { ...planGroup, 'plans': planGroup.plans.split(',') };
    }

    const toDBType = (planGroup: FrontPlanGroupsType): DB0003PlanGroupsType => {
        return { ...planGroup, 'plans': planGroup.plans.join() };
    }

    const createPlanGroup = async (representativeStartTime: Date = new Date(1970, 0, 1, 0, 0, 0)): Promise<void> => {
        const plan: DB0004PlansType = await useCT0002.createPlan();
        const planGroup: DB0003PlanGroupsType = await DB0003PlanGroups.create(itineraryID);
        const frontPlanGroup: FrontPlanGroupsType = toFrontType(planGroup);
        frontPlanGroup.representativePlanID  = plan.id;
        frontPlanGroup.representativeStartTime = representativeStartTime;
        frontPlanGroup.plans = [plan.id];
        DB0003PlanGroups.update(toDBType(frontPlanGroup));
        setPlanGroups([frontPlanGroup, ...planGroups].sort((a: FrontPlanGroupsType, b: FrontPlanGroupsType) => a.representativeStartTime.getTime() - b.representativeStartTime.getTime()));
    }

    const updatePlanGroup = async (index: number, planGroup: FrontPlanGroupsType): Promise<void> => {
        DB0003PlanGroups.update(toDBType(planGroup));
        planGroups[index] = planGroup;
        setPlanGroups(planGroups.sort((a: FrontPlanGroupsType, b: FrontPlanGroupsType) => a.representativeStartTime.getTime() - b.representativeStartTime.getTime()))
    }

    const deletePlanGroup = (index: number, planGroup: FrontPlanGroupsType) => {
        DB0003PlanGroups.deleteData(toDBType(planGroup));
        setPlanGroups(planGroups.filter((x, i) => i != index));
    }

    const changeRepresentativePlanID = (index: number, planIndex: number) => {
        const planGroup = planGroups[index];
        planGroup.representativePlanID = planGroup.plans[planIndex];
        planGroup.representativeStartTime = plans[planGroup.representativePlanID].startTime;
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
    }

    const removePlan = (index: number, planIndex: number, isremoveFromPlanGroup: boolean = true) => {
        const planGroup = planGroups[index];
        const [removedPlanID] = planGroup.plans.splice(planIndex, 1);
        if (planGroup.plans.length !== 0) {
            if (isremoveFromPlanGroup && removedPlanID === planGroup.representativePlanID) {
                changeRepresentativePlanID(index, 0);
            }
            DB0003PlanGroups.update(toDBType(planGroup));
            setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
        }
        else {
            deletePlanGroup(index, planGroup);
        }
        return removedPlanID;
    }

    const deletePlan = (index: number, planIndex: number) => {
        const removedPlanID = removePlan(index, planIndex);
        useCT0002.deletePlan(removedPlanID);
    }

    const insertPlan = async (index: number, planIndex: number, planID: DB0004PlansType['id']): Promise<void> => {
        const planGroup = planGroups[index];
        if (!planID) {
            const plan = await useCT0002.createPlan();
            planID = plan.id;
        }
        planGroup.plans.splice(planIndex, 0, planID);
        console.log(planGroup.plans);
        DB0003PlanGroups.update(toDBType(planGroup));
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
    }


    if (isLoading) {
        return <AT0005Loader />
    }
    const value: CT0001PlanGroupsContextType = {
        planGroups,
        createPlanGroup,
        updatePlanGroup,
        changeRepresentativePlanID,
        removePlan,
        deletePlan,
        insertPlan,
    }
    return <CT0001PlanGroups.Provider value={value}>{children}</CT0001PlanGroups.Provider>
};
