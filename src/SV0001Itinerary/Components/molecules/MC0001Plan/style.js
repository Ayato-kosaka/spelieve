import styled from 'styled-components';
import AT0001TimeArea from 'SV0001Itinerary/Components/atoms/AT0001TimeArea';
import TimelineDot from '@material-ui/lab/TimelineDot';

const gridX = {
    1: 55,
    2: 10,
    3: 17,
    4: 2
}
export const StyledGridContainer = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: ${gridX[1]}px ${gridX[2]}px ${gridX[3]}px ${gridX[4]}px ${gridX[3]}px ${gridX[2]}px auto;
  grid-template-rows   : auto auto;
  grid-template-areas  : 'startTime . timelineDot timelineDot timelineDot . bodyArea'
                         'spanArea spanArea . connector . addPlan addPlan';

`;
export const StyledStartTimeArea = styled.div`
    grid-area: startTime;
`;
export const StyledTimelineDotArea = styled.div`
    grid-area: timelineDot;
    justify-self: center;
`;
export const StyledBodyArea = styled.div`
    grid-area: bodyArea;
    display: flex;
    flex-direction: row-reverse;
`;
export const StyledSpanArea = styled.div`
    grid-area: spanArea;
    justify-self: end;
    >.MuiInput-root{
        >input {
            text-align: right;
        }
    }
`;
export const StyledConnectorArea = styled.div`
    grid-area: connector;
    display: flex;
    flex-direction: column;
    height: ${gridX[3]+gridX[4]+gridX[3] + 10}px;
`;
export const StyledAddPlanArea = styled.div`
    grid-area: addPlan;
    >* {
        padding: 4px 12px !important;
        border-radius: ${(gridX[3]+gridX[4]+gridX[3])/2 - 1}px !important;
    }
`;

// TimelineDotArea
export const StyledTimelineDot = styled(TimelineDot)`
    margin: 0 !important;
    width: 5px;
    height: 5px;
`






export const halfHeight = 36;

export const StyledAT0001TimeArea = styled(AT0001TimeArea)`
`;
