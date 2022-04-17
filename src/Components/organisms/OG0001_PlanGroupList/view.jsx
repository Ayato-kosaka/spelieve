import { useTranslation } from "react-i18next";
import { Styled_div, Styled_OG0005_PlanGroup, Styled_Fab } from './style.js'
import React, { Component, useEffect, useState, useContext, createContext } from "react";
import HK0003_usePlanGroup from 'Hooks/HK0003_usePlanGroup'
import HK0002_usePlan from 'Hooks/HK0002_usePlan'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from '@material-ui/icons/Add';
import {PlanGroupsContext, PlansContext} from 'Components/organisms/OG0001_PlanGroupList/Context'
  
//↓Childrenにしたい
export const PlanGroupsProvider = (props) => { //PlanGroupsProvider
    const [planGroups, setPlanGroups] = useState([]);
    useEffect(async () => {
        setPlanGroups(await HK0003_usePlanGroup.getPlanGroups(props.itinerayId));
    }, []);
    return (
        <PlanGroupsContext.Provider value={{planGroups, setPlanGroups}}>
            <Body {...props} />
        </PlanGroupsContext.Provider>
    );
};

export const OG0001_PlanGroupList = (props) => {
    const [plans, setPlans] = useState({});
    const [finishedReadData, setFinishedReadData] = useState(false);
    useEffect(async () => {
        setPlans(await HK0002_usePlan.getPlans(props.itinerayId));
        setFinishedReadData(true);
    }, []);
    return (
        <PlansContext.Provider value={{plans, setPlans}}>
            {/* Plansを取得してから、次のレンダリングを始める */}
            {finishedReadData && <PlanGroupsProvider {...props} />}
        </PlansContext.Provider>
    );
};

export const Body = (props) => {
    const {planGroups, setPlanGroups} = useContext(PlanGroupsContext);
    const {plans, setPlans} = useContext(PlansContext);
	
    const onDragEnd = (result) => {
        if (!result.destination) { return; }
        let planGroupsCopy = planGroups.slice();
        let removedPlanId = planGroupsCopy[result.source.droppableId].deletePlan(result.source.index);
        planGroupsCopy[result.destination.droppableId].insertPlan(result.destination.index, removedPlanId);
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
        setPlanGroups([...planGroups, planGroup]);
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