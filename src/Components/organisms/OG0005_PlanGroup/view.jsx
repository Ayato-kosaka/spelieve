import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from 'react';
import { Styled_div, Styled_MC0001_Plan } from './style.js'
import CT0001_PlanGroups from 'Components/context/CT0001_PlanGroups.jsx'
import CT0002_Plans from 'Components/context/CT0002_Plans.jsx'
import { Droppable } from "react-beautiful-dnd";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Typography from '@material-ui/core/Typography';


export const OG0005_PlanGroup = (props) => {
  const { t } = useTranslation();
  const {plans, setPlans} = useContext(CT0002_Plans);
  const {planGroups, setPlanGroups} = useContext(CT0001_PlanGroups);
  let planGroup = planGroups[props.index];
  let representativePlanFoundedFlag = false;

  return (
    <Droppable droppableId={`${props.index}`}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
            <Timeline
                sx={{ px: 1, border: 1 }}
                align="left"
            >
                {planGroup.plans.map((planId, index) => {
                    let representiveFlag = planId===planGroup.representivePlanID;
                    let component = (
                        <Styled_MC0001_Plan 
                            key={planId}
                            planId={planId}
                            index={index} 
                            linkedIndexDiff={ (representiveFlag) ? 0 : (representativePlanFoundedFlag) ? -1 : 1 }
                            planGroupIndex={props.index}
                        />
                    )
                    representativePlanFoundedFlag |= representiveFlag;
                    return(component)
                })}
            </Timeline>
            {provided.placeholder}
            </div>
        )}
    </Droppable>
  )
}

