import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from 'react';
import CT0001_PlanGroups from 'Components/context/CT0001_PlanGroups.jsx'
import CT0002_Plans from 'Components/context/CT0002_Plans.jsx'
import { Styled_TimelineItem, Styled_BoxLeft, Styled_TimelineSeparator, Styled_TimelineDot, Styled_BoxRight, Styled_TimelineContent, Styled_ConnectorConent, Styled_AT0001_TimeArea } from './style.js'
import { Draggable } from "react-beautiful-dnd";
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import { timeToList } from 'Components/atoms/AT0001_TimeArea/view';

import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AccessTime from '@material-ui/icons/AccessTime';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { SliderValueLabel } from "@material-ui/core";

export const MC0001_Plan = (props) => {
    const { t } = useTranslation();
    const { plans, setPlans } = useContext(CT0002_Plans);
    const { planGroups, setPlanGroups } = useContext(CT0001_PlanGroups);
    const [plan, setPlan] = useState(plans[props.planId]);

    let linkedIndex = props.index + props.linkedIndexDiff;
    let planGroup = planGroups[props.planGroupIndex];
    let linkedPlan = plans[planGroup.plans[linkedIndex]];
    let startTime = undefined; //state にすべき？（したらエラーが出る）
    if (!props.linkedIndexDiff || linkedPlan && linkedPlan.startTime) {
        startTime = new Date(
            !props.linkedIndexDiff ? planGroup.representiveStartTime.getTime() : linkedPlan.startTime.getTime()
        );
        let linkedSpan = props.linkedIndexDiff == 1 ? plan.span : linkedPlan.span;
        startTime.setHours(startTime.getHours() - timeToList(linkedSpan)[0] * props.linkedIndexDiff);
        startTime.setMinutes(startTime.getMinutes() - timeToList(linkedSpan)[1] * props.linkedIndexDiff);
    }
    useEffect(() => {
        let plan = plans[props.planId];
        plan.startTime = startTime;
        setPlans({ ...plans, [props.planId]: plan });
    }, [startTime && startTime.getTime()]);

    const handleTitleChange = event => {
        const { name, value } = event.target;
        setPlan({ ...plan, [name]: value });
    }
    const handleBlur = event => {
        let { name, value } = event.target;
        value = event.target.getAttribute('time') || value;
        let plan = plans[props.planId];
        plan.update({ [name]: value })
        setPlan(plan);
        setPlans({ ...plans, [props.planId]: plan })
    }
    const updateRepresentiveStartTime = event => {
        let [hour, min] = timeToList(event.target.getAttribute('time'));
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
        setPlans({ ...plans, [props.planId]: plan });
    }
    const deletePlan = () => {
        let planGroupsCopy = [...planGroups];
        planGroupsCopy[props.planGroupIndex].deletePlan(props.index, plans[planGroup.plans[0]].startTime);
        if (planGroupsCopy[props.planGroupIndex].plans.length == 0) { planGroupsCopy.splice(props.planGroupIndex, 1); }
        plan.delete();
        setPlanGroups(planGroupsCopy);
    }


    return (
        <Draggable draggableId={plan.id} index={props.index}>
            {(provided, snapshot) => (
                <Styled_TimelineItem
                    ref={provided.innerRef}
                    snapshot={snapshot}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    tabIndex="-1"
                >
                    <Styled_BoxLeft>
                        <Styled_AT0001_TimeArea
                            isInput={!props.linkedIndexDiff}
                            value={startTime}
                            inputProps={{
                                "name": "representiveStartTime",
                                "onBlur": updateRepresentiveStartTime
                            }}
                        />
                        <Box />
                    </Styled_BoxLeft>
                    <Styled_TimelineSeparator>
                        <Styled_TimelineDot>
                            <FastfoodIcon />
                        </Styled_TimelineDot>
                        <TimelineConnector />
                    </Styled_TimelineSeparator>
                    <Styled_BoxRight>
                        <Styled_TimelineContent>
                            <Input
                                size="small"
                                inputProps={{
                                    "name": "title",
                                    "placeholder": "タイトル",
                                    "value": plan.title,
                                    "onChange": handleTitleChange,
                                    "onBlur": handleBlur
                                }}
                            />
                            <IconButton onClick={deletePlan}>
                                <DeleteIcon />
                            </IconButton>
                        </Styled_TimelineContent>
                        <Styled_ConnectorConent>
                            <AccessTime size="small" />
                            <Styled_AT0001_TimeArea
                                value={plan.span}
                                // hourUnit='hr '
                                // minUnit='min'
                                inputProps={{
                                    "name": "span",
                                    "onBlur": handleBlur
                                }}
                            />
                            <IconButton>
                                <AddCircleOutline />
                            </IconButton>
                        </Styled_ConnectorConent>
                    </Styled_BoxRight>
                </Styled_TimelineItem>
            )
            }
        </Draggable>
    )
}