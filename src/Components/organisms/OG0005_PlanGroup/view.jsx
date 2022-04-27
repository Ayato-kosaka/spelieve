import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from 'react';
import { Styled_div, Styled_MC0001_Plan } from './style.js'
import CT0001_PlanGroups from 'Components/context/CT0001_PlanGroups.jsx'
import CT0002_Plans from 'Components/context/CT0002_Plans.jsx'
import HK0002_usePlan from 'Hooks/HK0002_usePlan'
import { Droppable } from "react-beautiful-dnd";
import Timeline from '@material-ui/lab/Timeline';


export const OG0005_PlanGroup = (props) => {
  const { t } = useTranslation();
  const {plans, setPlans} = useContext(CT0002_Plans);
  const {planGroups, setPlanGroups} = useContext(CT0001_PlanGroups);
  let planGroup = planGroups[props.index];
  let representativePlanFoundedFlag = false;

  const createPlan = async(index) => {
      console.log(index)
      let plan = await new HK0002_usePlan(planGroup.itineraryId).create();
      planGroup.insertPlan(index, plan.id);
      setPlans({...plans, [plan.id]: plan});
      setPlanGroups([...planGroups.slice(0,props.index), planGroup, ...planGroups.slice(props.index+1, planGroups.length)]);
  }

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
                            createPlan={createPlan}
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

