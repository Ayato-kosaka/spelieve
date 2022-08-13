import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { StyledOG0005PlanGroup } from './style.js'

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import MC0006AddPlanGroupButton from 'SV0001Itinerary/Components/molecules/MC0006AddPlanGroupButton';

import Typography from '@material-ui/core/Typography';


const OG0001PlanGroupList = (props) => {
    const { t } = useTranslation();
    const { planGroups, ...useCT0001 } = useContext(CT0001PlanGroups);
    let dayNumber = 0;

    const onDragEnd = (result) => {
        if (!result.destination) { return; }
        let removedPlanID = useCT0001.removePlan(result.source.droppableId, result.source.index, result.source.droppableId !== result.destination.droppableId);
        useCT0001.insertPlan(result.destination.droppableId, result.destination.index, removedPlanID);
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {planGroups.map((planGroup, index) => {
                    let straddleDayNum = Math.floor((planGroup.representativeStartTime - HK0001Utils.initialDate()) / HK0001Utils.milliSecondsADay) + 1 - dayNumber;
                    dayNumber += straddleDayNum
                    return (
                        <div key={planGroup.id}>
                            {!!straddleDayNum && <Typography variant="h4">{dayNumber}{t('日目')}</Typography>}
                            <StyledOG0005PlanGroup
                                index={index}
                            />
                        </div>
                    )
                })}
            </DragDropContext>
            <MC0006AddPlanGroupButton />
        </>
    )
}
export default OG0001PlanGroupList;
