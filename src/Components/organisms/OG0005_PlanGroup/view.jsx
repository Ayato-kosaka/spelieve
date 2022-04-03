import { useTranslation } from "react-i18next";
import React, { useState } from 'react';

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
  const { className } = props;
  const { t } = useTranslation();
  const [startTimes, setStartTimes] = useState(props.startTimes);
  return (
    <Timeline
        sx={{ px: 1, border: 1 }}
        align="left"
    >
        {startTimes.map(val => {
        return(
            <Styled_MC0001_Plan startTime={val} ></Styled_MC0001_Plan>
        )
        })}
      {/* <TextField id="outlined-basic" size="small" label="タイトル" variant="outlined" />
      <TextField id="outlined-basic" size="small" label="経過時間" variant="outlined" /> */}
    </Timeline>
  )
}