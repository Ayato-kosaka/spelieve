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

export const OG0005_PlanGroup = (props) => {
  const { t } = useTranslation();
  return (
    <Droppable droppableId={`${props.prefix}`}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
            <h1>{props.h1}</h1>
            <Timeline
                sx={{ px: 1, border: 1 }}
                align="left"
            >
                {props.elements.map((item, index) => {
                return(
                    <Styled_MC0001_Plan key={item} item={item} index={index} ></Styled_MC0001_Plan>
                )
                })}
            </Timeline>
            {provided.placeholder}
            </div>
        )}
    </Droppable>
  )
}