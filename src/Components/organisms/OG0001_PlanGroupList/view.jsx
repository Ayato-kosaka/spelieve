import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Styled_OG0005_PlanGroup, Styled_Fab, Styled_WrrapAddPlanGroup } from './style.js'

import CT0001_PlanGroups from 'Hooks/contexts/CT0001_PlanGroups'
import CT0002_Plans from 'Hooks/contexts/CT0002_Plans'

import AddIcon from '@material-ui/icons/Add';
  



const OG0001_PlanGroupList = (props) => {
    const {planGroups, setPlanGroups, createPlanGroup, swapPlan, removePlan, insertPlan} = useContext(CT0001_PlanGroups);
    const {plans} = useContext(CT0002_Plans);
	
    const onDragEnd = (result) => {
        if (!result.destination) { return; }
        if(result.source.droppableId == result.destination.droppableId){
            swapPlan(result.source.droppableId, result.source.index, result.destination.index);
        }else{
            let removedPlanId = removePlan(result.source.droppableId, result.source.index);
            insertPlan(result.destination.droppableId, result.destination.index, removedPlanId);
        }
    };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        {planGroups.map((planGroup, index) => {
            return(
                <Styled_OG0005_PlanGroup
                    key={planGroup.id}
                    index={index}
                />
            )
        })}
        
        <Styled_WrrapAddPlanGroup>
            <Styled_Fab 
                color="primary" 
                aria-label="add"
                onClick={createPlanGroup}
            >
                <AddIcon />
            </Styled_Fab>
        </Styled_WrrapAddPlanGroup>
    </DragDropContext>
  )
}
export default OG0001_PlanGroupList;