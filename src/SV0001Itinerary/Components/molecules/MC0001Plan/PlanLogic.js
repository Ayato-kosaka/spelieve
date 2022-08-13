import { useEffect, useContext } from 'react';

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans'

export const useMC0001 = ({
    planGroupIndex = 0,
    planIndex,
    planID,
    stopCalculating = true,
}) => {
    const { planGroups } = useContext(CT0001PlanGroups);
    const planGroup = planGroups[planGroupIndex];
    const { plans, setPlans } = useContext(CT0002Plans);
    const plan = plans[planID];

    const representativePlanIndex = planGroup.plans.indexOf(planGroup.representativePlanID);

    const isRepresentativePlan = representativePlanIndex === planIndex;

    const linkedIndexDiff = function () {
        if (stopCalculating) { return null; }
        if (representativePlanIndex > planIndex) {
            return 1;
        } else if (representativePlanIndex === planIndex) {
            return 0;
        } else {
            return -1
        }
    }();

    const linkedSpan = function () {
        if (stopCalculating) { return null; }
        switch (linkedIndexDiff) {
            case 1: return plan.span;
            case 0: return null;
            case -1: return plans[planGroup.plans[planIndex + linkedIndexDiff]]?.span
        }
    }()

    const linkedStartTime = plans[planGroup.plans[planIndex + linkedIndexDiff]]?.startTime;

    useEffect(() => {
        if (!stopCalculating) {
            if (isRepresentativePlan) {
                plan.startTime = planGroup.representativeStartTime;
            } else if (linkedStartTime) {
                plan.startTime = new Date(linkedStartTime)
                plan.startTime.setHours(linkedStartTime.getHours() - linkedSpan.getHours() * linkedIndexDiff);
                plan.startTime.setMinutes(linkedStartTime.getMinutes() - linkedSpan.getMinutes() * linkedIndexDiff);
            }
            setPlans({ ...plans, [planID]: plan });
        }
    }, [linkedStartTime?.getTime(), linkedSpan?.getTime(), linkedIndexDiff])

    return ({ isRepresentativePlan })
}
export default useMC0001;