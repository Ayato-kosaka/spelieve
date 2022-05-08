import { useTranslation } from "react-i18next";
import { Component, useEffect, useState, useContext, createContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Styled_OG0005_PlanGroup, Styled_Fab, Styled_WrrapAddPlanGroup } from './style.js'
import HK0003_usePlanGroup from 'Hooks/HK0003_usePlanGroup'
import HK0002_usePlan from 'Hooks/HK0002_usePlan'

import CT0001_PlanGroups from 'Hooks/contexts/CT0001_PlanGroups'
import CT0002_Plans from 'Hooks/contexts/CT0002_Plans'

import AddIcon from '@material-ui/icons/Add';
  



const OG0001_PlanGroupList = (props) => {
    const {planGroups, setPlanGroups, createPlanGroup} = useContext(CT0001_PlanGroups);
    const {plans} = useContext(CT0002_Plans);
    // useEffect(async () => {
    //     let plans = await HK0002_usePlan.getPlans(props.itineraryId);
    //     let planGroups = await HK0003_usePlanGroup.getPlanGroups(props.itineraryId);
    //     if(planGroups.length){
    //         setPlans(plans);
    //         setPlanGroups(planGroups);
    //     }else{
    //         await createPlanGroup();
    //     }
    // }, []);
	
    const onDragEnd = (result) => {
        if (!result.destination) { return; }
        let planGroupsCopy = planGroups.slice();
        if(result.source.droppableId == result.destination.droppableId){
            planGroupsCopy[result.source.droppableId].swapPlan(result.source.index, result.destination.index)
        }else{
            let removedPlanId = planGroupsCopy[result.source.droppableId].deletePlan(result.source.index, plans[planGroupsCopy[result.source.droppableId].plans[0]].startTime);
            planGroupsCopy[result.destination.droppableId].insertPlan(result.destination.index, removedPlanId);
        }
        if(planGroupsCopy[result.source.droppableId].plans.length==0){ planGroupsCopy.splice(result.source.droppableId, 1); }
        setPlanGroups(planGroupsCopy);
    };

    // const createPlanGroup = async() => {
    //     let plan = await new HK0002_usePlan(props.itineraryId).create();
    //     let planGroup = await new HK0003_usePlanGroup(props.itineraryId).create();
    //     planGroup.update({
    //         "representivePlanID": plan.id,
    //         "representiveStartTime": new Date(1970, 1, 1, 0, 0, 0),
    //         "plans": plan.id
    //     });
    //     setPlans({...plans, [plan.id]: plan})
    //     setPlanGroups([planGroup, ...planGroups]);
    // }

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