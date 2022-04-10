import styled from 'styled-components';
import { AT0001_TimeArea } from 'Components/atoms/AT0001_TimeArea/view';
import Box from '@material-ui/core/Box';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineContent from '@material-ui/lab/TimelineContent';

export const halfHeight = 36;

export const Styled_AT0001_TimeArea = styled(AT0001_TimeArea)`
  width: 70px;
`;

export const Styled_TimelineItem = styled(TimelineItem)`
    &:before  {
        display: none;
    }
`

export const Styled_BoxLeft = styled(Box)`
    display: flex;
    flex-direction: column;
    >* {
        height: ${halfHeight}px;
    }
`

export const Styled_TimelineSeparator = styled(TimelineSeparator)`
    width: ${halfHeight}px;
    margin: 0 10px;
`
export const Styled_TimelineDot = styled(TimelineDot)`
    margin: 0 !important;
    width: ${halfHeight-11}px;
    height: ${halfHeight-11}px;
`

export const Styled_BoxRight = styled(Box)`
    display: flex;
    flex-direction: column;
    >* {
        height: ${halfHeight}px;
    }
`
export const Styled_TimelineContent = styled(Box)`
    display: flex;
    align-items: center;
`
export const Styled_ConnectorConent = styled (Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: ${halfHeight+10}px;
`