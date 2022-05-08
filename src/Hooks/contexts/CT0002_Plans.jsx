import { useState, createContext, useEffect } from "react";
import * as DB0004Plans from 'Utils/api/DB0004Plans';
import AT0005Loader from'Components/atoms/AT0005Loader';

const CT0002_Plans = createContext({plans: {}});
export default CT0002_Plans;

export const CT0002_PlansProvider = ({itineraryId, children}) => {
    const [plans, setPlans] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(async () => {
        let plans = await DB0004Plans.readAll(itineraryId);
        setPlans(Object.fromEntries(
            plans.map((x)=>[x.id, x])    
        ));
        setIsLoading(false);
    }, []);
    
    const createPlan = async () => {
        let plan = await DB0004Plans.create(itineraryId);
        setPlans({...plans, [plan.id]: plan});
        return(plan);
    }
    
    if(isLoading){
        return <AT0005Loader />
    }
    const value = {
        plans,
        setPlans, //消す
        createPlan,
    }
    return <CT0002_Plans.Provider value={value}>{children}</CT0002_Plans.Provider>
};
