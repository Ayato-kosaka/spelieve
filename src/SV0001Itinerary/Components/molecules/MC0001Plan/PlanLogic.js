
import { useState, useEffect, useContext } from 'react';

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans'

export const useMC0001 = ({
    index,
    planGroupIndex,
    planId,
    linkedIndexDiff,
    isDragging,
}) => {
    const { plans, setPlans, ...useCT0002 } = useContext(CT0002Plans);
    const { planGroups, ...useCT0001 } = useContext(CT0001PlanGroups);
    const [plan, setPlan] = useState(plans[planId]);
    const planGroup = planGroups[planGroupIndex];
    const [linkedPlan, setLinkedPlan] = useState(plans[planGroup.plans[index + linkedIndexDiff]]);
    const isRepresentativePlan = !linkedIndexDiff;

    useEffect(() => {
        if(!isDragging){
            setLinkedPlan(plans[planGroup.plans[index + linkedIndexDiff]])
        }
    }, [index + linkedIndexDiff])

    let linkedSpan = linkedIndexDiff == 1 ? plan.span : linkedPlan.span;

    useEffect(() => {
        if(isRepresentativePlan){
            plan.startTime = planGroup.representiveStartTime;
        }else if (linkedPlan && linkedPlan.startTime) {
            plan.startTime = new Date(linkedPlan.startTime);
            plan.startTime.setHours(plan.startTime.getHours() - linkedSpan.getHours() * linkedIndexDiff);
            plan.startTime.setMinutes(plan.startTime.getMinutes() - linkedSpan.getMinutes() * linkedIndexDiff);
        }
        setPlan(plan)
        setPlans({ ...plans, [planId]: plan });
    }, [(linkedPlan && linkedPlan.startTime && linkedPlan.startTime.getTime()), (linkedSpan && linkedSpan.getTime())]);

    const updatePlan = (plan) => {
        useCT0002.updatePlan(plan);
        setPlan(plan);
    }

    const updateRepresentiveStartTime = (hour, min) => {
        plan.startTime = new Date(planGroup.representiveStartTime.getTime());
        plan.startTime.setHours(hour);
        plan.startTime.setMinutes(min);
        planGroup.representiveStartTime = new Date(plan.startTime);
        useCT0001.updatePlanGroup(planGroupIndex, planGroup)
        setPlan(plan);
        setPlans({ ...plans, [planId]: plan });
    }

    const changeRepresentivePlanID = () => {
        useCT0001.changeRepresentivePlanID(planGroupIndex, index);
    }

    return{
        plan,
        setPlan,
        isRepresentativePlan,
        updatePlan,
        updateRepresentiveStartTime,
        deletePlan: useCT0001.deletePlan,
        insertPlan: useCT0001.insertPlan,
        changeRepresentivePlanID,
    }
}
export default useMC0001;