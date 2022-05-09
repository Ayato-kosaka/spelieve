import { useState, createContext, useContext, useEffect } from "react";
import * as DB0003PlanGroups from 'Utils/api/DB0003PlanGroups';
import AT0005Loader from'Components/atoms/AT0005Loader';
import CT0002_Plans from 'Hooks/contexts/CT0002_Plans'

const CT0001_PlanGroups = createContext({});
export default CT0001_PlanGroups;

export const CT0001_PlanGroupsProvider = ({itineraryId, children}) => {
    const [planGroups, setPlanGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const {plans, ...useCT0002} = useContext(CT0002_Plans);
    
    useEffect(async () => {
        let planGroups = await DB0003PlanGroups.readAll(itineraryId);
        if(planGroups.length){
            setPlanGroups(planGroups);
        }else{
            await createPlanGroup();
        }
        setIsLoading(false);
    }, []);
    
    const createPlanGroup = async() => {
        let plan = await useCT0002.createPlan();
        let planGroup = await DB0003PlanGroups.create(itineraryId);
        planGroup.representivePlanID = plan.id;
        planGroup.representiveStartTime = new Date(1970, 1, 1, 0, 0, 0);
        planGroup.plans = [plan.id];
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([planGroup, ...planGroups]);
    }
    
    const swapPlan = (index, planIndex_i, planIndex_j) => {
        let planGroup = planGroups[index];
        let tmp = planGroup.plans[planIndex_i]
        planGroup.plans[planIndex_i] = planGroup.plans[planIndex_j]
        planGroup.plans[planIndex_j] = tmp
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([...planGroups.slice(0,index), planGroup, ...planGroups.slice(index+1, planGroups.length)]);
    }
    
    const removePlan = (index, planIndex) => {
        let planGroup = planGroups[index];
        let [removed] = planGroup.plans.splice(planIndex, 1);
        if(planGroup.plans.length!=0){
            if(removed==planGroup.representivePlanID){
                planGroup.representivePlanID = planGroup.plans[0];
                planGroup.representiveStartTime = plans[planGroup.representivePlanID].startTime;
            }
            DB0003PlanGroups.update(planGroup);
        }else{
            DB0003PlanGroups.deleteData(planGroup);
        }
        setPlanGroups([...planGroups.slice(0,index), planGroup, ...planGroups.slice(index+1, planGroups.length)]);
        return removed;
    }
    
    const deletePlan = (index, planIndex) => {
        let removedPlanId = removePlan(index, planIndex);
        useCT0002.deletePlan(removedPlanId);
    }
    
    const insertPlan = async (index, planIndex, planId) => {
        let planGroup = planGroups[index];
        if(!planId){
            let plan = await useCT0002.createPlan();
            planId = plan.id;
        }
        planGroup.plans.splice(planIndex, 0, planId);
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([...planGroups.slice(0,index), planGroup, ...planGroups.slice(index+1, planGroups.length)]);
    }
    
    
    if(isLoading){
        return <AT0005Loader />
    }
    const value = {
        planGroups,
        setPlanGroups, //消す
        createPlanGroup,
        swapPlan,
        removePlan,
        deletePlan,
        insertPlan,
    }
    return <CT0001_PlanGroups.Provider value={value}>{children}</CT0001_PlanGroups.Provider>
};