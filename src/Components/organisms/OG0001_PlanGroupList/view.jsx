import { useTranslation } from "react-i18next";
import { Styled_div, Styled_OG0005_PlanGroup, Styled_Fab } from './style.js'
import React, { Component, useEffect, useState, useContext, createContext } from "react";
import HK0003_usePlanGroup from 'Hooks/HK0003_usePlanGroup'
import HK0002_usePlan from 'Hooks/HK0002_usePlan'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from '@material-ui/icons/Add';
import CT0001_PlanGroups from 'Components/context/CT0001_PlanGroups.jsx'
import CT0002_Plans from 'Components/context/CT0002_Plans.jsx'
  



export const OG0001_PlanGroupList = (props) => {
    const {planGroups, setPlanGroups} = useContext(CT0001_PlanGroups);
    const {plans, setPlans} = useContext(CT0002_Plans);
    useEffect(async () => {
        let plans = await HK0002_usePlan.getPlans(props.itinerayId);
        let planGroups = await HK0003_usePlanGroup.getPlanGroups(props.itinerayId)
        setPlans(plans);
        setPlanGroups(planGroups);
    }, []);
	
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

    const createPlanGroup = async() => {
        let plan = await new HK0002_usePlan(props.itinerayId).create();
        let planGroup = await new HK0003_usePlanGroup(props.itinerayId).create();
        planGroup.update({
            "representivePlanID": plan.id,
            "representiveStartTime": new Date(1970, 1, 1, 0, 0, 0),
            "plans": plan.id
        });
        setPlans({...plans, [plan.id]: plan})
        setPlanGroups([planGroup, ...planGroups]);
    }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <Styled_Fab 
            color="primary" 
            aria-label="add"
            onClick={createPlanGroup}
        >
            <AddIcon />
        </Styled_Fab>
        {planGroups.map((planGroup, index) => {
            return(
                <Styled_OG0005_PlanGroup
                    key={planGroup.id}
                    index={index}
                />
            )
        })}
    </DragDropContext>
  )
}