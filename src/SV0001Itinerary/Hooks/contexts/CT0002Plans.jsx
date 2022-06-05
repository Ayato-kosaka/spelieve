import { useState, createContext, useEffect } from 'react';
import * as DB0004Plans from 'SV0001Itinerary/Utils/api/DB0004Plans';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';

const CT0002Plans = createContext({ plans: {} });
export default CT0002Plans;

export const CT0002PlansProvider = ({ itineraryId, children }) => {
    const [plans, setPlans] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let plans = await DB0004Plans.readAll(itineraryId);
            setPlans(Object.fromEntries(
                plans.map((x) => [x.id, x])
            ));
            setIsLoading(false);
        }
        fetchData();
    }, [itineraryId]);

    const createPlan = async () => {
        let plan = await DB0004Plans.create(itineraryId);
        setPlans({ ...plans, [plan.id]: plan });
        return (plan);
    }

    const deletePlan = async (id) => {
        DB0004Plans.deleteData(plans[id]);
        delete plans[id];
    }

    const updatePlan = async (plan) => {
        DB0004Plans.update(plan);
        setPlans({ ...plans, [plan.id]: plan });
    }

    if (isLoading) {
        return <AT0005Loader />
    }
    const value = {
        plans,
        setPlans,
        createPlan,
        deletePlan,
        updatePlan,
    }
    return <CT0002Plans.Provider value={value}>{children}</CT0002Plans.Provider>
};
