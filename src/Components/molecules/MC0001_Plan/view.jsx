import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from 'react';
import CT0001_PlanGroups from 'Hooks/contexts/CT0001_PlanGroups'
import CT0002_Plans from 'Hooks/contexts/CT0002_Plans'
import {
    Styled_TimelineDot, Styled_AT0001_TimeArea, Styled_AddPlanArea, Styled_BodyArea,
    Styled_GridContainer, Styled_StartTimeArea, Styled_TimelineDotArea, Styled_SpanArea, Styled_ConnectorArea
} from './style.js'
import { Draggable } from "react-beautiful-dnd";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DragHandleIcon from '@material-ui/icons/DragHandle';

export const MC0001_Plan = ({
    planId,
    createPlan,
    showSpan = true,
    showAddPlan = true,
    ...props
}) => {
    const { t } = useTranslation();
    const { plans, setPlans } = useContext(CT0002_Plans);
    const { planGroups, setPlanGroups } = useContext(CT0001_PlanGroups);
    const [plan, setPlan] = useState(plans[planId]);

    let linkedIndex = props.index + props.linkedIndexDiff;
    let planGroup = planGroups[props.planGroupIndex];
    let linkedPlan = plans[planGroup.plans[linkedIndex]];
    let startTime = undefined; //state にすべき？（したらエラーが出る）
    if (!props.linkedIndexDiff || linkedPlan && linkedPlan.startTime) {
        startTime = new Date(
            !props.linkedIndexDiff ? planGroup.representiveStartTime.getTime() : linkedPlan.startTime.getTime()
        );
        let linkedSpan = props.linkedIndexDiff == 1 ? plan.span : linkedPlan.span;
        startTime.setHours(startTime.getHours() - linkedSpan.getHours() * props.linkedIndexDiff);
        startTime.setMinutes(startTime.getMinutes() - linkedSpan.getMinutes() * props.linkedIndexDiff);
    }
    useEffect(() => {
        let plan = plans[planId];
        plan.startTime = startTime;
        setPlans({ ...plans, [planId]: plan });
    }, [startTime && startTime.getTime()]);

    const handleTitleChange = event => {
        const { name, value } = event.target;
        setPlan({ ...plan, [name]: value });
    }
    const handleBlur = event => {
        let { name, value } = event.target;
        if (event.target.getAttribute('time')) {
            value = new Date(1970, 1, 1, ...(event.target.getAttribute('time').split(',')));
        }
        let plan = plans[planId];
        plan.update({ [name]: value })
        setPlan(plan);
        setPlans({ ...plans, [planId]: plan })
    }
    const updateRepresentiveStartTime = event => {
        let [hour, min] = event.target.getAttribute('time').split(',');
        let planGroup = planGroups[props.planGroupIndex];
        startTime = new Date(planGroup.representiveStartTime.getTime());
        startTime.setHours(hour);
        startTime.setMinutes(min);
        planGroup.update({
            'representiveStartTime': startTime
        });
        let planGroupsCopy = planGroups;
        planGroupsCopy[props.planGroupIndex] = planGroup;
        setPlanGroups(planGroupsCopy.sort((a, b) => b.representiveStartTime - a.representiveStartTime))
        plan.startTime = startTime;
        setPlans({ ...plans, [planId]: plan });
    }
    const deletePlan = () => {
        let planGroupsCopy = [...planGroups];
        console.log(planGroup, props.index)
        planGroupsCopy[props.planGroupIndex].deletePlan(props.index, plans[planGroup.plans[0]].startTime);
        if (planGroupsCopy[props.planGroupIndex].plans.length == 0) { planGroupsCopy.splice(props.planGroupIndex, 1); }
        plan.delete();
        setPlanGroups(planGroupsCopy);
    }

    const handleAddPlanClick = () => {
        createPlan(props.index+1);
    }

    return (
        <Draggable draggableId={plan.id} index={props.index}>
            {(provided, snapshot) => (
                <Styled_GridContainer
                    ref={provided.innerRef}
                    snapshot={snapshot}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    tabIndex="-1"
                >
                    <Styled_StartTimeArea>
                        <Styled_AT0001_TimeArea
                            isInput={!props.linkedIndexDiff}
                            value={startTime}
                            inputProps={{
                                "name": "representiveStartTime",
                                "onBlur": updateRepresentiveStartTime
                            }}
                        />
                    </Styled_StartTimeArea>

                    <Styled_TimelineDotArea>
                        <Styled_TimelineDot {...(!props.linkedIndexDiff ? { "color": "primary" } : {})} />
                    </Styled_TimelineDotArea>

                    <Styled_BodyArea>
                        <IconButton onClick={deletePlan} tabIndex={-1} sx={{ px: 0 }} >
                            <CloseIcon />
                        </IconButton>
                        <OutlinedInput
                            size="small"
                            inputProps={{
                                "name": "title",
                                "placeholder": "タイトル",
                                "value": plan.title,
                                "onChange": handleTitleChange,
                                "onBlur": handleBlur
                            }}
                            sx={{flexGrow: 1}}
                            endAdornment={
                                <InputAdornment position="end" >
                                    <DragHandleIcon
                                        size="small"
                                        style={{"cursor": "default"}}
                                    />
                                </InputAdornment>
                            }
                        />
                    </Styled_BodyArea>

                    <Styled_SpanArea style={showSpan ? {} : {'display': 'none'}}>
                        <Styled_AT0001_TimeArea
                            value={plan.span}
                            hourUnit='hr '
                            minUnit='min'
                            inputProps={{
                                "name": "span",
                                "onBlur": handleBlur
                            }}
                        />
                    </Styled_SpanArea>

                    <Styled_ConnectorArea style={showSpan||showAddPlan ? {} : {'display': 'none'}}>
                        <TimelineConnector />
                    </Styled_ConnectorArea>

                    <Styled_AddPlanArea onClick={handleAddPlanClick} style={showAddPlan ? {} : {'display': 'none'}}>
                        <Button variant="outlined" color="inherit" tabIndex={-1} startIcon={<AddIcon />}>
                            {t("予定を追加")}
                        </Button>
                    </Styled_AddPlanArea>



                </Styled_GridContainer>
            )
            }
        </Draggable>
    )
}