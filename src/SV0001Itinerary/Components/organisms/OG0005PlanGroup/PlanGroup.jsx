import { useState, useContext } from 'react';
import AT0007AddPlanButton from 'SV0001Itinerary/Components/atoms/AT0007AddPlanButton';
import MC0001Plan from 'SV0001Itinerary/Components/molecules/MC0001Plan';
import OG0006EditablePlan from 'SV0001Itinerary/Components/organisms/OG0006EditablePlan';
import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Timeline from '@material-ui/lab/Timeline';

export const OG0005PlanGroup = (props) => {
    const { planGroups, ...useCT0001 } = useContext(CT0001PlanGroups);
    const planGroup = planGroups[props.index];

    const [showAddPlan, setShowAddPlan] = useState(true);
    const addFirstPlan = async () => {
        setShowAddPlan(false);
        await useCT0001.insertPlan(props.index, 0);
        setShowAddPlan(true);
    }

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
                    <MC0001Plan
                        AddPlanArea={(
                            showAddPlan ?
                            <AT0007AddPlanButton
                                onClick={ addFirstPlan }
                            /> :
                            <div/>
                        )}
                    />
                    {planGroup.plans.map((planId, index) => {
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
                                        <OG0006EditablePlan 
                                            planGroupIndex={props.index}
                                            planIndex={index} 
                                            planId={planId}
                                            isDragging={isDragging}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        )
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