import React, { useState, createContext, useEffect, Dispatch, SetStateAction, ReactNode } from 'react';
import * as DB0004Plans from 'SV0001Itinerary/Utils/api/DB0004Plans';
import AT0005Loader from 'SV0001Itinerary/Components/atoms/AT0005Loader';
import type { DB0002ItinerariesType } from 'SV0001Itinerary/Utils/types/DB0002ItinerariesType';
import type { DB0004PlansType } from 'SV0001Itinerary/Utils/types/DB0004PlansType';
import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'

type CT0002PlansProviderProps = {
    itineraryID: DB0002ItinerariesType['id'];
    children: ReactNode;
};

type FrontPlanType = DB0004PlansType & { startTime: Date; };

type PlansStateType = {
    [id: DB0004PlansType['id']]: FrontPlanType;
};

type valueType = {
    plans: PlansStateType,
    setPlans: Dispatch<SetStateAction<PlansStateType>>;
    createPlan: () => Promise<FrontPlanType>;
    deletePlan: (id: FrontPlanType['id']) => Promise<void>;
    updatePlan: (plan: FrontPlanType) => Promise<void>,
};

// createContextに型設定しないといけないっぽい?abCg
const CT0002Plans = createContext<valueType>({ plans: {} } as valueType);
export default CT0002Plans;


export const CT0002PlansProvider = (
    { itineraryID, children }: CT0002PlansProviderProps
) => {
    const [plans, setPlans] = useState<PlansStateType>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const plans: DB0004PlansType[] = await DB0004Plans.readAll(itineraryID);
            setPlans(() => {
                return Object.fromEntries(
                    plans.map((x: DB0004PlansType) => {
                        const plan: FrontPlanType = planConverter(x);
                        return [plan.id, plan];
                    })
                )
            })
            setPlans(Object.fromEntries(
                plans.map((x: DB0004PlansType) => [x.id, x])
            ) as PlansStateType);
            setIsLoading(false);
        }
        fetchData();
    }, [itineraryID]);

    const planConverter = (plan: DB0004PlansType): FrontPlanType => {
        return { ...plan, startTime: HK0001Utils.initialDate() }
    }

    const createPlan = async (): Promise<FrontPlanType> => {
        const plan: DB0004PlansType = await DB0004Plans.create(itineraryID);
        const frontPlan: FrontPlanType = planConverter(plan);
        setPlans({ ...plans, [frontPlan.id]: frontPlan });
        return frontPlan;
    }

    const deletePlan = async (id: FrontPlanType['id']) => {
        DB0004Plans.deleteData(plans[id]);
        delete plans[id];
    }

    const updatePlan = async (plan: FrontPlanType) => {
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
