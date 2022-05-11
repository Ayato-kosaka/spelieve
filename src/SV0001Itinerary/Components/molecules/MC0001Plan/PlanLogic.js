
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
    const [linkedIndex, setLinkedIndex] = useState(index + linkedIndexDiff);
    const planGroup = planGroups[planGroupIndex];
    const isRepresentativePlan = !linkedIndexDiff;
    
    useEffect(() => {
        if(!isDragging){
            setLinkedIndex(index + linkedIndexDiff)
        }
    }, [index + linkedIndexDiff])
    
    let linkedPlan = plans[planGroup.plans[linkedIndex]]
    let linkedSpan = linkedIndexDiff == 1 ? plan.span : linkedPlan.span;
    
    useEffect(() => {
        // console.log(`From useEffect, planID=>${planId}, catch=>${[(linkedPlan.startTime && linkedPlan.startTime.getTime()), (linkedSpan && linkedSpan.getTime())]}`)
        if(isRepresentativePlan){
            plan.startTime = planGroup.representiveStartTime;
        }else if (linkedPlan && linkedPlan.startTime) {
            plan.startTime = new Date(linkedPlan.startTime);
            plan.startTime.setHours(plan.startTime.getHours() - linkedSpan.getHours() * linkedIndexDiff);
            plan.startTime.setMinutes(plan.startTime.getMinutes() - linkedSpan.getMinutes() * linkedIndexDiff);
        }
        setPlan(plan)
        setPlans({ ...plans, [planId]: plan });
    }, [(linkedPlan.startTime && linkedPlan.startTime.getTime()), (linkedSpan && linkedSpan.getTime())]);
    
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

    return{
        plan, 
        setPlan,
        isRepresentativePlan,
        updatePlan,
        updateRepresentiveStartTime,
        deletePlan: useCT0001.deletePlan,
        insertPlan: useCT0001.insertPlan,
    }
}
export default useMC0001;