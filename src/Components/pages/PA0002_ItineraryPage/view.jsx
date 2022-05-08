import { useTranslation } from "react-i18next";
import usePA0002, {returnTop, useAlert} from './ItineraryPageLogic'
import { Styled_div } from './style.js'

import * as DB0002Itineraries from 'Utils/api/DB0002Itineraries';

import AT0005Loader from'Components/atoms/AT0005Loader';
import OG0001_PlanGroupList from 'Components/organisms/OG0001_PlanGroupList/view';
import { CT0001_PlanGroupsProvider } from 'Hooks/contexts/CT0001_PlanGroups'
import { CT0002_PlansProvider } from 'Hooks/contexts/CT0002_Plans'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';



const PA0002_ItineraryPage = (props) => {
    const { t } = useTranslation();
    const {itinerary, setItinerary, isLoading} = usePA0002();
    const {open, handleCloseAlert, copyURL} = useAlert();

    const handleChange = event => {
        const { name, value } = event.target;
        setItinerary({...itinerary, [name]: value });
    }

    const handleBlur = () => {
        DB0002Itineraries.update(itinerary);
    }
    
    if(isLoading){
        return <AT0005Loader />
    }
    return (
        <Styled_div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
                <Alert severity="info" elevation={6} sx={{ width: '100%' }}>
                    {t("このページのURLをコピーしました。")}
                </Alert>
            </Snackbar>
            <TextField
                id="outlined-basic"
                fullWidth
                label={t("タイトル")}
                variant="outlined"
                inputProps={{
                    "name": "title",
                    "value": itinerary.title || "",
                    "onChange": handleChange,
                    onBlur: handleBlur
                }}
                sx={{ my: 2 }}
            />
            
            <CT0002_PlansProvider itineraryId={itinerary.id}>
                <CT0001_PlanGroupsProvider itineraryId={itinerary.id}>
                    <OG0001_PlanGroupList />
                </CT0001_PlanGroupsProvider>
            </CT0002_PlansProvider>
            
            <Button
                variant="outlined"
                color="inherit"
                tabIndex={-1}
                fullWidth
                style={{'borderRadius': '18px'}}
                sx={{mb: 4}}
                onClick={copyURL}
            >
                {t("URLをコピー")}
            </Button>
            
            <Button
                variant="outlined"
                color="inherit"
                tabIndex={-1}
                fullWidth
                style={{'borderRadius': '18px'}}
                sx={{mb: 4}}
                onClick={returnTop}
            >
                {t("一番上へ")}
            </Button>
        </Styled_div>
    )
}
export default PA0002_ItineraryPage;