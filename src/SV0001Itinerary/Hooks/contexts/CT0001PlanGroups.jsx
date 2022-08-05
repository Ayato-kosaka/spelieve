import { useState, createContext, useContext, useEffect } from 'react';
import * as DB0003PlanGroups from 'SV0001Itinerary/Utils/api/DB0003PlanGroups';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans'

const CT0001PlanGroups = createContext({});
export default CT0001PlanGroups;

export const CT0001PlanGroupsProvider = ({ itineraryID, children }) => {
    const [planGroups, setPlanGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { plans, ...useCT0002 } = useContext(CT0002Plans);

    useEffect(() => {
        const fetchData = async () => {
            let planGroups = await DB0003PlanGroups.readAll(itineraryID);
            if (planGroups.length) {
                setPlanGroups(planGroups);
            }
            else {
                await createPlanGroup();
            }
            setIsLoading(false);
        }
        fetchData();
    }, [itineraryID]);

    const createPlanGroup = async (representiveStartTime = new Date(1970, 0, 1, 0, 0, 0)) => {
        let plan = await useCT0002.createPlan();
        let planGroup = await DB0003PlanGroups.create(itineraryID);
        planGroup.representivePlanID = plan.id;
        planGroup.representiveStartTime = representiveStartTime;
        planGroup.plans = [plan.id];
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([planGroup, ...planGroups].sort((a, b) => a.representiveStartTime - b.representiveStartTime));
    }

    const updatePlanGroup = async (index, planGroup) => {
        DB0003PlanGroups.update(planGroup);
        planGroups[index] = planGroup;
        setPlanGroups(planGroups.sort((a, b) => a.representiveStartTime - b.representiveStartTime))
    }

    const deletePlanGroup = (index, planGroup) => {
        DB0003PlanGroups.deleteData(planGroup);
        setPlanGroups(planGroups.filter((x, i) => i != index));
    }

    const changeRepresentivePlanID = (index, planIndex) => {
        let planGroup = planGroups[index];
        planGroup.representivePlanID = planGroup.plans[planIndex];
        planGroup.representiveStartTime = plans[planGroup.representivePlanID].startTime;
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
    }

    const removePlan = (index, planIndex, isremoveFromPlanGroup = true) => {
        let planGroup = planGroups[index];
        let [removedPlanID] = planGroup.plans.splice(planIndex, 1);
        if (planGroup.plans.length !== 0) {
            if (isremoveFromPlanGroup && removedPlanID === planGroup.representivePlanID) {
                changeRepresentivePlanID(index, 0);
            }
            DB0003PlanGroups.update(planGroup);
            setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
        }
        else {
            deletePlanGroup(index, planGroup);
        }
        return removedPlanID;
    }

    const deletePlan = (index, planIndex) => {
        let removedPlanID = removePlan(index, planIndex);
        useCT0002.deletePlan(removedPlanID);
    }

    const insertPlan = async (index, planIndex, planID) => {
        let planGroup = planGroups[index];
        if (!planID) {
            let plan = await useCT0002.createPlan();
            planID = plan.id;
        }
        planGroup.plans.splice(planIndex, 0, planID);
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([...planGroups.slice(0, index), planGroup, ...planGroups.slice(index + 1, planGroups.length)]);
    }


    if (isLoading) {
        return <AT0005Loader />
    }
    const value = {
        planGroups,
        createPlanGroup,
        changeRepresentivePlanID,
        removePlan,
        deletePlan,
        insertPlan,
        updatePlanGroup,
    }
    return <CT0001PlanGroups.Provider value={value}>{children}</CT0001PlanGroups.Provider>
};
