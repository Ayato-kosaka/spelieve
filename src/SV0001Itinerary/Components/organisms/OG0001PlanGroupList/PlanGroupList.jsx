import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Styled_OG0005PlanGroup, Styled_Fab, Styled_WrrapAddPlanGroup } from './style.js'

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'

import AddIcon from '@material-ui/icons/Add';




const OG0001PlanGroupList = (props) => {
    const { planGroups, createPlanGroup, swapPlan, removePlan, insertPlan } = useContext(CT0001PlanGroups);

    const onDragEnd = (result) => {
        if (!result.destination) { return; }
        if (result.source.droppableId == result.destination.droppableId) {
            swapPlan(result.source.droppableId, result.source.index, result.destination.index);
        }
        else {
            let removedPlanId = removePlan(result.source.droppableId, result.source.index);
            insertPlan(result.destination.droppableId, result.destination.index, removedPlanId);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        {planGroups.map((planGroup, index) => {
            return(
                <Styled_OG0005PlanGroup
                    key={planGroup.id}
                    index={index}
                />
            )
        })}
        
        <Styled_WrrapAddPlanGroup>
            <Styled_Fab 
                color='primary' 
                aria-label='add'
                onClick={createPlanGroup}
            >
                <AddIcon />
            </Styled_Fab>
        </Styled_WrrapAddPlanGroup>
    </DragDropContext>
    )
}
export default OG0001PlanGroupList;
