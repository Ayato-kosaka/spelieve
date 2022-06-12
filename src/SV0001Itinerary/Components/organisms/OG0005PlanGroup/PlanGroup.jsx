import { useContext } from 'react';
import { StyledMC0001Plan } from './style.js'
import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Timeline from '@material-ui/lab/Timeline';


export const OG0005PlanGroup = (props) => {
    const { planGroups } = useContext(CT0001PlanGroups);
    let planGroup = planGroups[props.index];
    let representativePlanFoundedFlag = false;

    return (
        <Droppable droppableId={`${props.index}`}>
        {(provided, snapshot) => (
            <div {...provided.droppableProps} 
                ref={provided.innerRef} 
                style={{'marginBottom': '50px', 'paddingTop': `${!snapshot.draggingFromThisWith ? 0: 46*planGroup.plans.indexOf(snapshot.draggingFromThisWith)}px`}}
            >
                <Timeline
                    sx={{ px: 1 }}
                    align='left'
                >
                    {planGroup.plans.map((planId, index) => {
                        let representiveFlag = planId===planGroup.representivePlanID;
                        let isDragging = !!snapshot.draggingFromThisWith
                        let component = (
                            <Draggable draggableId={planId} index={index} key={planId}>
                                {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef}
                                        snapshot={snapshot}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        tabIndex='-1'
                                    >
                                        <StyledMC0001Plan 
                                            planId={planId}
                                            index={index} 
                                            linkedIndexDiff={ (representiveFlag) ? 0 : (representativePlanFoundedFlag) ? -1 : 1 } //0->代表, 1->下参照, -1->上参照
                                            planGroupIndex={props.index}
                                            isDragging={isDragging}
                                            showSpan={!isDragging}
                                            showAddPlanProps={!isDragging}
                                        />
                                    </div>
                                )}
                            </Draggable>
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
export default OG0005PlanGroup;