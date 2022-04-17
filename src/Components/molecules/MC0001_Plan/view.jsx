import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from 'react';
import {PlanGroupsContext, PlansContext} from 'Components/organisms/OG0001_PlanGroupList/Context'
import { Styled_TimelineItem, Styled_BoxLeft, Styled_TimelineSeparator, Styled_TimelineDot, Styled_BoxRight, Styled_TimelineContent, Styled_ConnectorConent, Styled_AT0001_TimeArea } from './style.js'
import { Draggable } from "react-beautiful-dnd";
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';

import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

export const MC0001_Plan = (props) => {
  const { t } = useTranslation();
  const {plans, setPlans} = useContext(PlansContext);
//   const {plans, setPlans} = props;
//   const {planGroups, setPlanGroups} = props;
  const [plan, setPlan] = useState(plans[props.planId]);
  useEffect( () => {
    if(props.representiveFlag){
        props.updateBuffa(props.startTime)
    }
  }, []);
  const handleTitleChange = event => {
    const { name, value } = event.target;
    setPlan({ ...plan, [name]: value });
  }
  const handleTitleBlur = event => {
    const { name, value } = event.target;
    plans[props.planId].update({ [name]: value })
    setPlans({ ...plans, [props.planId]: plans[props.planId] })
  }
  const handleStartTimeBlur = (date) => {

  }

  return (
        <Draggable draggableId={plan.id} index={props.index}>
        {(provided, snapshot) => {
            return (
                <Styled_TimelineItem
                    ref={provided.innerRef}
                    snapshot={snapshot}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Styled_BoxLeft>
                        <Styled_AT0001_TimeArea
                            isInput={props.representiveFlag}
                            value={props.startTime}
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
                                    "onBlur": handleTitleBlur
                                }} 
                            />
                            <DeleteIcon />
                        </Styled_TimelineContent>   
                        <Styled_ConnectorConent>  
                            <Styled_AT0001_TimeArea
                                value={new Date(1970, 1, 1, parseInt(plan.span.split(':')[0]), parseInt(plan.span.split(':')[1]), 0)}
                            /> 
                        </Styled_ConnectorConent>    
                    </Styled_BoxRight>
                </Styled_TimelineItem>
            );
        }}
        </Draggable>
  )
}