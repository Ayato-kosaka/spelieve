import { Styled_div, Styled_OG0005_PlanGroup } from './style.js'
import React, { Component, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


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
const planGroupList = ["planGroup1", "planGroup2"];

export const OG0001_PlanGroupList = (props) => {

	const [elements, setElements] = useState([[1,2,3],[4,5]]);

	
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        console.log(result);
        const listCopy = { ...elements };
    
        const sourceList = listCopy[result.source.droppableId];
        console.log(sourceList);
        const [removedElement, newSourceList] = removeFromList(
            sourceList,
            result.source.index
        );
        listCopy[result.source.droppableId] = newSourceList;
        const destinationList = listCopy[result.destination.droppableId];
        listCopy[result.destination.droppableId] = addToList(
            destinationList,
            result.destination.index,
            removedElement
        );
    
        setElements(listCopy);
    };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        {planGroupList.map((planGroup, index) => (
            <Styled_OG0005_PlanGroup
                elements={elements[index]}
                key={planGroup}
                prefix={index}
                h1={planGroup}
            />
        ))}
    </DragDropContext>
    
  )
}