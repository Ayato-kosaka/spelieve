import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { Droppable } from "react-beautiful-dnd";

import { Styled_div, Styled_MC0001_Plan } from './style.js'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Typography from '@material-ui/core/Typography';

const plans = {
    "plan0001": {
        "title": "日光IC",
        "span": "1:00",
        "prevPlan": "",
        "nextPlan": "plan0002"
    },
    "plan0002": {
        "title": "日光山内",
        "span": "4:00",
        "prevPlan": "plan0001",
        "nextPlan": "plan0003"
    },
    "plan0003": {
        "title": "湯波グルメ",
        "span": "3:00",
        "prevPlan": "plan0002",
        "nextPlan": "plan0004"
    },
    "plan0004": {
        "title": "鬼怒川温泉",
        "span": "2:00",
        "prevPlan": "plan0003",
        "nextPlan": ""
    },
    "plan0005": {
        "title": "鬼怒川ライン下り",
        "span": "2:00",
        "prevPlan": "",
        "nextPlan": "plan0006"
    },
    "plan0006": {
        "title": "鬼怒川のテーマパーク",
        "span": "3:45",
        "prevPlan": "plan0005",
        "nextPlan": "plan0007"
    },
    "plan0007": {
        "title": "中禅寺湖",
        "span": "1:15",
        "prevPlan": "plan0006",
        "nextPlan": "plan0008"
    },
    "plan0008": {
        "title": "清滝IC",
        "span": "2:45",
        "prevPlan": "plan0007",
        "nextPlan": ""
    }
}

export const OG0005_PlanGroup = (props) => {
  const { t } = useTranslation();
  return (
    <Droppable droppableId={`${props.index}`}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
            <h1>{props.planGroup.id}</h1>
            <Timeline
                sx={{ px: 1, border: 1 }}
                align="left"
            >
                {props.planGroup.Plans.map((plan, index) => {
                    return(
                        <Styled_MC0001_Plan 
                            key={plan}
                            plan={plans[plan]} 
                            planId={plan}
                            index={index} 
                        />
                    )
                })}
            </Timeline>
            {provided.placeholder}
            </div>
        )}
    </Droppable>
  )
}