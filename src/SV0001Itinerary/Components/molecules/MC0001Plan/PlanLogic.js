import { useTranslation } from 'react-i18next'
import { useState, useEffect, useContext } from 'react';

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans'
import CT0003Dialog from 'SV0000Common/Hooks/contexts/CT0003Dialog';
import MC0005DateTime from 'SV0001Itinerary/Components/molecules/MC0005DateTime';

export const useMC0001 = ({
    index,
    planGroupIndex,
    planId,
    linkedIndexDiff,
    isDragging,
}) => {
    const { t } = useTranslation();
    const { plans, setPlans, ...useCT0002 } = useContext(CT0002Plans);
    const { planGroups, ...useCT0001 } = useContext(CT0001PlanGroups);
    const useCT0003 = useContext(CT0003Dialog);
    const [plan, setPlan] = useState(plans[planId]);
    const planGroup = planGroups[planGroupIndex];
    const isRepresentativePlan = !linkedIndexDiff;
    
    const linkedSpan = (() => {
        switch(linkedIndexDiff){
            case 1: return plan.span;
            case 0: return null;
            case -1: return plans[planGroup.plans[index + linkedIndexDiff]]?.span
        }
    })()
    
    const linkedStartTime = plans[planGroup.plans[index + linkedIndexDiff]]?.startTime;
    
    useEffect(() => {
        if(!isDragging){
            if(isRepresentativePlan){
                plan.startTime = planGroup.representiveStartTime;
            }else if (linkedStartTime) {
                plan.startTime = new Date(linkedStartTime)
                plan.startTime.setHours(linkedStartTime.getHours() - linkedSpan.getHours() * linkedIndexDiff);
                plan.startTime.setMinutes(linkedStartTime.getMinutes() - linkedSpan.getMinutes() * linkedIndexDiff);
            }
            setPlan(plan)
            setPlans({ ...plans, [planId]: plan });
        }
    }, [linkedStartTime?.getTime(), linkedSpan?.getTime(), linkedIndexDiff])

    const updatePlan = (plan) => {
        useCT0002.updatePlan(plan);
        setPlan(plan);
    }

    const openEditStartTimeDialog = () => {
        const initialDate = new Date(planGroup.representiveStartTime.getTime());
        initialDate.setHours(plan.startTime.getHours());
        initialDate.setMinutes(plan.startTime.getMinutes());
        useCT0003.setFormData({ date: initialDate })
        useCT0003.openDialog({
            title: t('代表プランを変更'),
            content: `${t('代表プランを変更します')}\n${t('代表プランは自動計算の基準となります')}\n${t('何日目の何時に変更するか入力してください')}`,
            formArea: (
                <MC0005DateTime
                    setFormData={
                        (x) => {
                            useCT0003.setFormData(x)
                        }
                    }
                    initialDate={ initialDate }
                    skipDateFocus
                />
            ),
            submitButtonName: t('変更'),
            onSubmit: (formData) => {
                planGroup.representiveStartTime = formData.date
                planGroup.representivePlanID = planId
                useCT0001.updatePlanGroup(planGroupIndex, planGroup)
                plan.startTime = new Date(planGroup.representiveStartTime.getTime());
                setPlan(plan);
                setPlans({ ...plans, [planId]: plan });
            }
        });
    }

    return{
        plan,
        setPlan,
        isRepresentativePlan,
        updatePlan,
        deletePlan: useCT0001.deletePlan,
        insertPlan: useCT0001.insertPlan,
        openEditStartTimeDialog,
    }
}
export default useMC0001;