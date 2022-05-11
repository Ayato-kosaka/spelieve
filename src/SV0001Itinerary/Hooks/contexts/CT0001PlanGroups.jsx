import { useState, createContext, useContext, useEffect } from 'react';
import * as DB0003PlanGroups from 'SV0001Itinerary/Utils/api/DB0003PlanGroups';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans'

const CT0001PlanGroups = createContext({});
export default CT0001PlanGroups;

export const CT0001PlanGroupsProvider = ({ itineraryId, children }) => {
    const [planGroups, setPlanGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { plans, ...useCT0002 } = useContext(CT0002Plans);

    useEffect(() => {
        const fetchData = async () => {
            let planGroups = await DB0003PlanGroups.readAll(itineraryId);
            if (planGroups.length) {
                setPlanGroups(planGroups);
            }
            else {
                await createPlanGroup();
            }
            setIsLoading(false);
        }
        fetchData();
    }, [itineraryId]);

    const createPlanGroup = async () => {
        let plan = await useCT0002.createPlan();
        let planGroup = await DB0003PlanGroups.create(itineraryId);
        planGroup.representivePlanID = plan.id;
        planGroup.representiveStartTime = new Date(1970, 1, 1, 0, 0, 0);
        planGroup.plans = [plan.id];
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([planGroup, ...planGroups]);
    }

    const updatePlanGroup = async (index, planGroup) => {
        DB0003PlanGroups.update(planGroup);
        planGroups[index] = planGroup;
        setPlanGroups(planGroups.sort((a, b) => b.representiveStartTime - a.representiveStartTime))
    }

    const swapPlan = (index, planIndex_i, planIndex_j) => {
        let planGroup = planGroups[index];
        let tmp = planGroup.plans[planIndex_i]
        planGroup.plans[planIndex_i] = planGroup.plans[planIndex_j]
        planGroup.plans[planIndex_j] = tmp
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
    }

    const removePlan = (index, planIndex) => {
        let planGroup = planGroups[index];
        let [removed] = planGroup.plans.splice(planIndex, 1);
        if (planGroup.plans.length !== 0) {
            if (removed === planGroup.representivePlanID) {
                planGroup.representivePlanID = planGroup.plans[0];
                planGroup.representiveStartTime = plans[planGroup.representivePlanID].startTime;
            }
            DB0003PlanGroups.update(planGroup);
        }
        else {
            DB0003PlanGroups.deleteData(planGroup);
        }
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
        return removed;
    }

    const deletePlan = (index, planIndex) => {
        let removedPlanId = removePlan(index, planIndex);
        useCT0002.deletePlan(removedPlanId);
    }

    const insertPlan = async (index, planIndex, planId) => {
        let planGroup = planGroups[index];
        if (!planId) {
            let plan = await useCT0002.createPlan();
            planId = plan.id;
        }
        planGroup.plans.splice(planIndex, 0, planId);
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
    }


    if (isLoading) {
        return <AT0005Loader />
    }
    const value = {
        planGroups,
        createPlanGroup,
        swapPlan,
        removePlan,
        deletePlan,
        insertPlan,
        updatePlanGroup,
    }
    return <CT0001PlanGroups.Provider value={value}>{children}</CT0001PlanGroups.Provider>
};
