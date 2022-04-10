import { Styled_div, Styled_OG0005_PlanGroup } from './style.js'
import React, { Component, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const itinerary = {
    "title": "日光・鬼怒川・中禅寺湖",
    "PlanGroups": [
        {
            "id": "PlansGroupings0001",
            "representivePlanID": "plan0003",
            "representiveStartTime": "1970/01/01T20:00:00",
            "Plans": ["plan0001", "plan0002", "plan0003", "plan0004"]
        },
        {
            "id": "PlansGroupings0002",
            "representivePlanID": "plan0005",
            "representiveStartTime": "1970/01/02T10:00:00",
            "Plans": ["plan0005", "plan0006", "plan0007", "plan0008"]
        }
    ]
}

const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
};
  
const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
};

export const OG0001_PlanGroupList = (props) => {
	const [planGroups, setPlanGroups] = useState(itinerary.PlanGroups);

	
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        console.log(result);
        
        const planGropsCopy = planGroups;
    
        const sourceList = planGropsCopy[result.source.droppableId].Plans;
        const [removedElement, newSourceList] = removeFromList(
            sourceList,
            result.source.index
        );
        planGropsCopy[result.source.droppableId].Plans = newSourceList;

        const destinationList = planGropsCopy[result.destination.droppableId].Plans;
        planGropsCopy[result.destination.droppableId].Plans = addToList(
            destinationList,
            result.destination.index,
            removedElement
        );
    
        setPlanGroups(planGropsCopy);
    };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        {planGroups.map((planGroup, index) => (
            <Styled_OG0005_PlanGroup
                planGroup={planGroup}
                key={planGroup.id}
                index={index}
            />
        ))}
    </DragDropContext>
    
  )
}