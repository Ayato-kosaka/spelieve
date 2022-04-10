import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
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
  return (
        <Draggable draggableId={props.planId} index={props.index}>
        {(provided, snapshot) => {
            return (
                <Styled_TimelineItem
                    ref={provided.innerRef}
                    snapshot={snapshot}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Styled_BoxLeft>
                        <Styled_AT0001_TimeArea  />  
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
                            <Input size="small" defaultValue={props.plan.title} inputProps={{"placeholder": "タイトル"}} />
                            <DeleteIcon />
                        </Styled_TimelineContent>   
                        <Styled_ConnectorConent>  
                            <Styled_AT0001_TimeArea /> 
                        </Styled_ConnectorConent>    
                    </Styled_BoxRight>
                </Styled_TimelineItem>
            );
        }}
        </Draggable>
  )
}