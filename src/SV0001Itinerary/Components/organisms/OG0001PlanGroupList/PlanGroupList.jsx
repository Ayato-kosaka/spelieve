import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Styled_OG0005PlanGroup, Styled_Fab, Styled_WrrapAddPlanGroup } from './style.js'

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups'
import CT0003Dialog from 'SV0001Itinerary/Hooks/contexts/CT0003Dialog'
import MC0005DateTime from 'SV0001Itinerary/Components/molecules/MC0005DateTime';

import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';




const OG0001PlanGroupList = (props) => {
    const { t } = useTranslation();
    const { planGroups, createPlanGroup, swapPlan, removePlan, insertPlan } = useContext(CT0001PlanGroups);
    const useCT0003 = useContext(CT0003Dialog);

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

    const handleAddPlanGroupClick = () => {
        useCT0003.openDialog({
            title: t('新しい代表プランを作成'),
            content: `${t('新しい代表プランを作成します')}\n${t('代表プランは自動計算の基準となります')}\n${t('何日目の何時の予定か入力してください')}`,
            formArea: (
                <MC0005DateTime />
            ),
            submitButtonName: t('作成'),
            onSubmit: createPlanGroup,
        });
    }

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
                color='secondary'
                aria-label='add'
                onClick={handleAddPlanGroupClick}
            >
                <AddIcon />
            </Styled_Fab>
        </Styled_WrrapAddPlanGroup>
    </DragDropContext>
    )
}
export default OG0001PlanGroupList;
