import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';

import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'
import AT0001TimeArea from 'SV0001Itinerary/Components/atoms/AT0001TimeArea';
import AT0007AddPlanButton from 'SV0001Itinerary/Components/atoms/AT0007AddPlanButton';
import MC0001Plan from 'SV0001Itinerary/Components/molecules/MC0001Plan';
import MC0005DateTime from 'SV0001Itinerary/Components/molecules/MC0005DateTime';
import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import CT0002Plans from 'SV0001Itinerary/Hooks/contexts/CT0002Plans'
import CT0003Dialog from 'SV0000Common/Hooks/contexts/CT0003Dialog';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

export const OG0006EditablePlan = ({
    planGroupIndex,
    planIndex,
    planId,
    isDragging,
    ...props
}) => {
    const { t } = useTranslation();
    const { planGroups, ...useCT0001 } = useContext(CT0001PlanGroups);
    const planGroup = planGroups[planGroupIndex];
    const { plans, setPlans, ...useCT0002 } = useContext(CT0002Plans);
    const useCT0003 = useContext(CT0003Dialog);
    const plan = plans[planId];

    const [title, setTitle] = useState(plan.title);
    
    const handleStartTimeClick = () => {
        openEditStartTimeDialog();
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
                setPlans({ ...plans, [planId]: plan });
            }
        });
    }

    const handleTitleChange = event => {
        setTitle(event.target.value);
    }
    
    const handleBlur = async (event) => {
        let { name, value } = event.target;
        if (event.target.getAttribute('time')) {
            value = new Date(event.target.getAttribute('time'));
        }
        useCT0002.updatePlan({ ...plan, [name]: value });
    }
    
    useEffect(() => {
        if ((planIndex === planGroup.plans.length -1) && !(plan.title==='' && plan.span.getTime()===HK0001Utils.initialDate().getTime())) {
            handleAddPlanClick();
        }
    }, [plan])
    
    const handleDeletePlanClick = () => {
        useCT0001.deletePlan(planGroupIndex, planIndex);
    }

    const [showAddPlan, setShowAddPlan] = useState(true);
    const handleAddPlanClick = async () => {
        setShowAddPlan(false);
        await useCT0001.insertPlan(planGroupIndex, planIndex + 1)
        setShowAddPlan(true);
    }
    
    return (
        <MC0001Plan
            StartTimeArea={
                <Typography
                    onClick={ handleStartTimeClick }
                    sx={{ 
                        width: 55,
                        margin: 0
                    }}
                >
                    { plan.startTime ? HK0001Utils.formatDateToTime(plan.startTime) : '' }
                </Typography>
            }
            BodyArea={
                <>
                    <OutlinedInput
                        size='small'
                        inputProps={{
                            'name': 'title',
                            'placeholder': t('カフェでひといき'),
                            'value': title,
                            'onChange': handleTitleChange,
                            'onBlur': handleBlur
                        }}
                        sx={{flexGrow: 1}}
                        endAdornment={
                            <InputAdornment position='end' >
                                <DragIndicatorIcon
                                    size='small'
                                    style={{'cursor': 'default'}}
                                />
                            </InputAdornment>
                        }
                    />
                    <IconButton onClick={handleDeletePlanClick} tabIndex={-1} sx={{ px: 0 }} >
                        <CloseIcon />
                    </IconButton>
                </>
            }
            SpanArea={(
                !isDragging &&
                <AT0001TimeArea
                    dateTime={plan.span}
                    displayValue={ plan.span ? HK0001Utils.formatDateToTime(plan.span, 'hr ', 'min') : '' }
                    inputProps={{
                        'name': 'span',
                        'onBlur': handleBlur
                    }}
                />
            )}
            AddPlanArea={(
                showAddPlan && !isDragging &&
                <AT0007AddPlanButton
                    onClick={ handleAddPlanClick }
                />
            )}
            planGroupIndex={ planGroupIndex }
            planIndex={ planIndex }
            planId={ planId }
            stopCalculating={ isDragging }
        />
    )
};

export default OG0006EditablePlan;