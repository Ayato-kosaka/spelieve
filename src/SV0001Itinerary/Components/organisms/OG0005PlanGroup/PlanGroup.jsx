import { useContext } from 'react';
import { Styled_MC0001Plan } from './style.js'
import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import { Droppable } from 'react-beautiful-dnd';
import Timeline from '@material-ui/lab/Timeline';


export const OG0005PlanGroup = (props) => {
    const { planGroups } = useContext(CT0001PlanGroups);
    let planGroup = planGroups[props.index];
    let representativePlanFoundedFlag = false;

    return (
        <Droppable droppableId={`${props.index}`}>
        {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{'marginBottom': '50px'}}>
            <Timeline
                sx={{ px: 1 }}
                align='left'
            >
                {planGroup.plans.map((planId, index) => {
                    let representiveFlag = planId===planGroup.representivePlanID;
                    let component = (
                        <Styled_MC0001Plan 
                            key={planId}
                            planId={planId}
                            index={index} 
                            linkedIndexDiff={ (representiveFlag) ? 0 : (representativePlanFoundedFlag) ? -1 : 1 } //0->代表, 1->下参照, -1->上参照
                            planGroupIndex={props.index}
                            isDragging={!!snapshot.draggingFromThisWith}
                            // showSpan={!snapshot.draggingFromThisWith} //タッチ位置がずれるからやめとく
                            // showAddPlan={!snapshot.draggingFromThisWith}
                        />
                    )
                    representativePlanFoundedFlag |= representiveFlag;
                    return(component)
                })}
                {/* <Styled_MC0001Plan 
                            planId={planId}
                            index={index} 
                            linkedIndexDiff={ -1 }
                            planGroupIndex={props.index}
                /> */}
            </Timeline>
            {provided.placeholder}
            </div>
        )}
    </Droppable>
    )
}
export default OG0005PlanGroup;