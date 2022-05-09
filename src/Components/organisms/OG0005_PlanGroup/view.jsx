import { useContext } from 'react';
import { Styled_MC0001_Plan } from './style.js'
import CT0001_PlanGroups from 'Hooks/contexts/CT0001_PlanGroups'
import { Droppable } from "react-beautiful-dnd";
import Timeline from '@material-ui/lab/Timeline';


export const OG0005_PlanGroup = (props) => {
  const {planGroups} = useContext(CT0001_PlanGroups);
  let planGroup = planGroups[props.index];
  let representativePlanFoundedFlag = false;

  return (
    <Droppable droppableId={`${props.index}`}>
        {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{'marginBottom': '50px'}}>
            <Timeline
                sx={{ px: 1 }}
                align="left"
            >
                {planGroup.plans.map((planId, index) => {
                    let representiveFlag = planId===planGroup.representivePlanID;
                    let component = (
                        <Styled_MC0001_Plan 
                            key={planId}
                            planId={planId}
                            index={index} 
                            linkedIndexDiff={ (representiveFlag) ? 0 : (representativePlanFoundedFlag) ? -1 : 1 } //0->代表, 1->下参照, -1->上参照
                            planGroupIndex={props.index}
                            // showSpan={!snapshot.draggingFromThisWith} //タッチ位置がずれるからやめとく
                            // showAddPlan={!snapshot.draggingFromThisWith}
                        />
                    )
                    representativePlanFoundedFlag |= representiveFlag;
                    return(component)
                })}
                {/* <Styled_MC0001_Plan 
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

