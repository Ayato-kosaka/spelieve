import { useTranslation } from 'react-i18next'
import { useContext } from 'react';
import {
    Styled_Wrrapper,
    Styled_Fab,
}
from './style.js';

import CT0001PlanGroups from 'SV0001Itinerary/Hooks/contexts/CT0001PlanGroups';
import CT0003Dialog from 'SV0000Common/Hooks/contexts/CT0003Dialog';
import MC0005DateTime from 'SV0001Itinerary/Components/molecules/MC0005DateTime';

import AddIcon from '@material-ui/icons/Add';

export const MC0006AddPlanGroupButton = ({
    ...props
}) => {
    const { t } = useTranslation();
    const { createPlanGroup } = useContext(CT0001PlanGroups);
    const useCT0003 = useContext(CT0003Dialog);

    const handleAddPlanGroupClick = async () => {
        useCT0003.setFormData({
            date: 1,
            hour: 0,
            min: 0
        })
        useCT0003.openDialog({
            title: t('新しい代表プランを作成'),
            content: `${t('新しい代表プランを作成します')}\n${t('代表プランは自動計算の基準となります')}\n${t('何日目の何時の予定か入力してください')}`,
            formArea: (
                <MC0005DateTime
                    setFormData={
                        (x) => {
                            useCT0003.setFormData(x)
                        }
                    }
                />
            ),
            submitButtonName: t('作成'),
            onSubmit: (x) => {
                createPlanGroup(new Date(1970, 0, x.date, x.hour, x.min, 0))
            }
        });
    }

    return (
        <Styled_Wrrapper>
            <Styled_Fab
                color='secondary'
                aria-label='add'
                onClick={handleAddPlanGroupClick}
            >
                <AddIcon />
            </Styled_Fab>
        </Styled_Wrrapper>
    )
}
export default MC0006AddPlanGroupButton