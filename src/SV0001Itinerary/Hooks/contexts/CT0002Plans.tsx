import React, { useState, createContext, useEffect, Dispatch, SetStateAction, ReactNode } from 'react';
import * as DB0004Plans from 'SV0001Itinerary/Utils/api/DB0004Plans';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';
import type { DB0004PlanType } from 'SV0001Itinerary/Utils/types/DB0004PlanType';

type PlanStateType = {
    [key: string]: DB0004PlanType;
};

type CT0002PlansProviderProps = {
    itineraryID: string;
    children: ReactNode;
};

type valueType = {
    plans: PlanStateType,
    setPlans: Dispatch<SetStateAction<PlanStateType>>;
    createPlan: () => Promise<DB0004PlanType>;
    deletePlan: (id: string) => Promise<void>;
    updatePlan: (plan: DB0004PlanType) => Promise<void>,
};

// createContextに型設定しないといけないっぽい?abCg
const CT0002Plans = createContext<valueType>({ plans: {} } as valueType);
export default CT0002Plans;


export const CT0002PlansProvider = (
    { itineraryID, children }: CT0002PlansProviderProps
) => {
    const [plans, setPlans] = useState<PlanStateType>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            let plans: DB0004PlanType[] = await DB0004Plans.readAll(itineraryID);
            setPlans(Object.fromEntries(
                plans.map((x: DB0004PlanType) => [x.id, x])
            ));
            setIsLoading(false);
        }
        fetchData();
    }, [itineraryID]);

    const createPlan = async (): Promise<DB0004PlanType> => {
        let plan: DB0004PlanType = await DB0004Plans.create(itineraryID);
        setPlans({ ...plans, [plan.id]: plan });
        return plan;
    }

    const deletePlan = async (id: string) => {
        DB0004Plans.deleteData(plans[id]);
        delete plans[id];
    }

    const updatePlan = async (plan: DB0004PlanType) => {
        DB0004Plans.update(plan);
        setPlans({ ...plans, [plan.id]: plan });
    }

    if (isLoading) {
        return <AT0005Loader />
    }
    const value: valueType = {
        plans,
        setPlans,
        createPlan,
        deletePlan,
        updatePlan,
    }
    return <CT0002Plans.Provider value={value}>{children}</CT0002Plans.Provider>
};
