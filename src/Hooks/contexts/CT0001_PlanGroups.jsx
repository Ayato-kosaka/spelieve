import { useState, createContext, useContext, useEffect } from "react";
import * as DB0003PlanGroups from 'Utils/api/DB0003PlanGroups';
import AT0005Loader from'Components/atoms/AT0005Loader';
import CT0002_Plans from 'Hooks/contexts/CT0002_Plans'

const CT0001_PlanGroups = createContext({});
export default CT0001_PlanGroups;

export const CT0001_PlanGroupsProvider = ({itineraryId, children}) => {
    const [planGroups, setPlanGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const {createPlan} = useContext(CT0002_Plans);
    
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
        let plan = await createPlan();
        let planGroup = await DB0003PlanGroups.create(itineraryId);
        planGroup.representivePlanID = plan.id;
        planGroup.representiveStartTime = new Date(1970, 1, 1, 0, 0, 0);
        planGroup.plans = [plan.id];
        DB0003PlanGroups.update(planGroup);
        setPlanGroups([planGroup, ...planGroups]);
    }
    
    if(isLoading){
        return <AT0005Loader />
    }
    const value = {
        planGroups,
        setPlanGroups, //消す
        createPlanGroup,
    }
    return <CT0001_PlanGroups.Provider value={value}>{children}</CT0001_PlanGroups.Provider>
};