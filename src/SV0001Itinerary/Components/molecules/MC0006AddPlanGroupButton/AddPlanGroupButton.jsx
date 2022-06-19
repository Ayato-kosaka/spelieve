import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react';
import {
    StyledWrrapper,
    StyledFab,
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
        useCT0003.setFormData({ date: HK0001Utils.initialDate() })
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
                    initialDate={ HK0001Utils.initialDate() }
                />
            ),
            submitButtonName: t('作成'),
            onSubmit: (formData) => {
                createPlanGroup(formData.date);
            }
        });
    }

    return (
        <StyledWrrapper>
            <StyledFab
                color='secondary'
                aria-label='add'
                onClick={handleAddPlanGroupClick}
            >
                <AddIcon />
            </StyledFab>
        </StyledWrrapper>
    )
}
export default MC0006AddPlanGroupButton