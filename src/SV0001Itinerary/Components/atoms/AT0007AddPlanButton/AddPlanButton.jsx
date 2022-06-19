import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const AT0007AddPlanButton = ({
    onClick
}) => {
    const { t } = useTranslation();
    return (
        <Button
            variant='outlined'
            color='grey'
            tabIndex={-1}
            startIcon={<AddIcon />}
            onClick={ onClick }
        >
            {t('予定を追加')}
        </Button>
    )
}
export default AT0007AddPlanButton