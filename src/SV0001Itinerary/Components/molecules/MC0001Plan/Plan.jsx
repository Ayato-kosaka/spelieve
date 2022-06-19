import {
    StyledTimelineDot,
    StyledAddPlanArea,
    StyledBodyArea,
    StyledGridContainer,
    StyledStartTimeArea,
    StyledTimelineDotArea,
    StyledSpanArea,
    StyledConnectorArea
}
from './style.js';
import useMC0001 from './PlanLogic';

import TimelineConnector from '@material-ui/lab/TimelineConnector'


/**
 * Plan を表示させるためのGridを提供し、porpsで与えられた子コンポーネントを配置する。
 * Logic として、plansContext のstartTimeを管理する。
 */
export const MC0001Plan = ({
    StartTimeArea,
    BodyArea,
    SpanArea,
    AddPlanArea,
    ...props
}) => {
    const { isRepresentativePlan } = useMC0001(props);

    return (
        <StyledGridContainer>
            {(StartTimeArea || BodyArea) && (
                <>
                    <StyledStartTimeArea sx={ isRepresentativePlan ? { color: 'primary.main' } : {} } >
                        { StartTimeArea }
                    </StyledStartTimeArea>
        
                    <StyledTimelineDotArea>
                        <StyledTimelineDot { ...(isRepresentativePlan && { 'color': 'primary' }) } />
                    </StyledTimelineDotArea>
        
                    <StyledBodyArea>
                        { BodyArea }
                    </StyledBodyArea>
                </>
            )}
            
            {(SpanArea || AddPlanArea) && (
                <>
                    <StyledSpanArea>
                        { SpanArea }
                    </StyledSpanArea>
        
                    <StyledConnectorArea>
                        <TimelineConnector />
                    </StyledConnectorArea>
        
                    <StyledAddPlanArea>
                        { AddPlanArea }
                    </StyledAddPlanArea>
                </>
            )}
        </StyledGridContainer>
    )
}
export default MC0001Plan;