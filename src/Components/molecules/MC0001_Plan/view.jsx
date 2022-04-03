import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import { Styled_div, Styled_AT0001_TimeArea, Styled_AT0002_TitleArea } from './style.js'
import TextField from '@material-ui/core/TextField';
import { Draggable } from "react-beautiful-dnd";

import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

export const MC0001_Plan = (props) => {
  const { t } = useTranslation();
  return (
        <Draggable draggableId={`${props.item}`} index={props.index}>
        {(provided, snapshot) => {
            return (
                <div
                ref={provided.innerRef}
                snapshot={snapshot}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                <TimelineItem sx={{ m: '6px 0px', border: 1 }}>
                    <TimelineOppositeContent
                    sx={{ m: 'auto 0', px: 1, flexGrow: 1 }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                    >
                    {props.item}
                    </TimelineOppositeContent>
                    <TimelineSeparator sx={{ flexGrow: 1 }}>
                    <TimelineDot sx={{ mx: 'auto' }}>
                        <FastfoodIcon />
                    </TimelineDot>
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '6px', px: 2, flexGrow: 4, display: 'flex', alignItems: 'center' }}>
                        <TextField id="outlined-basic" size="small" label="タイトル" variant="outlined" />
                        <DeleteIcon />
                    </TimelineContent>
                </TimelineItem>
                </div>
            );
        }}
        </Draggable>




  )
}