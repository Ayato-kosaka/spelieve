import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from 'react';
import { Styled_div, Styled_MC0001_Plan } from './style.js'
import {PlanGroupsContext, PlansContext} from 'Components/organisms/OG0001_PlanGroupList/Context'
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
  const {plans, setPlans} = useContext(PlansContext);
  const {planGroups, setPlanGroups} = useContext(PlanGroupsContext);
  const [buffa, setBuffa] = useState(new Date(1970, 1, 1, 0, 0, 0));
//   const [sumTime, setSumTime] = useState(new Date(1970, 1, 1, 0, 0, 0));
  let sumTime = (new Date(1970, 1, 1, 0, 0, 0));

  const updateBuffa = (startTime) => {
    let tmp = new Date(buffa.toString());
    tmp.setHours(startTime.getHours() - planGroups[props.index].representiveStartTime.getHours());
    setBuffa(tmp);
  }
  return (
    <Droppable droppableId={`${props.index}`}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
            <h1>{planGroups[props.index].id}</h1>
            <Timeline
                sx={{ px: 1, border: 1 }}
                align="left"
            >
                {planGroups[props.index].plans.map((planId, index) => {
                    let startTime = new Date(sumTime.toString());
                    startTime.setHours(startTime.getHours() + planGroups[props.index].representiveStartTime.getHours() - buffa.getHours());
                    let component = (
                        <Styled_MC0001_Plan 
                            key={planId}
                            planId={planId}
                            index={index} 
                            startTime={startTime}
                            representiveFlag={planId===planGroups[props.index].representivePlanID}
                            updateBuffa={updateBuffa}
                            plans={plans}
                            setPlans={setPlans}
                            planGroups={planGroups}
                            setPlanGroups={setPlanGroups}
                        />
                    )
                    sumTime.setHours(sumTime.getHours() + parseInt(plans[planId].span.split(':')[0]));
                    return(component)
                })}
            </Timeline>
            {provided.placeholder}
            </div>
        )}
    </Droppable>
  )
}

