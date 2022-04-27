import { useTranslation } from "react-i18next";
import { useParams } from 'react-router-dom';
import React, { Component, useEffect, useState, createContext } from "react";
import HK0001_useItinerary from 'Hooks/HK0001_useItinerary'
import { Styled_div } from './style.js'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';


import { OG0001_PlanGroupList } from 'Components/organisms/OG0001_PlanGroupList/view';

import { CT0001_PlanGroupsProvider } from 'Components/context/CT0001_PlanGroups.jsx'
import { CT0002_PlansProvider } from 'Components/context/CT0002_Plans.jsx'

import { BL0014_insertItineraryTestData, BL0010_getItinerary, HK0001_Itinerary } from 'Hooks/HK0001_useItinerary'


export const PA0002_ItineraryPage = (props) => {
    const { t } = useTranslation();
    const [itinerary, setItinerary] = useState({});
    const params = useParams();
    useEffect(async () => {
        let id =  params.itineraryId;//kca5xiPI56W37IpRScU9
        let itinerary = await new HK0001_useItinerary().build(id);
        setItinerary(itinerary);
        window.history.pushState(null, null, "/itineraries/"+itinerary.id);
    }, []);


    const handleChange = event => {
        const { name, value } = event.target;
        let itineraryCopy = itinerary.copy();
        itineraryCopy.setBody({[name]: value });
        setItinerary(itineraryCopy);
    }

    const handleBlur = () => {
        itinerary.update();
    }

    const copyURL = () => {
        setOpen(true);
        navigator.clipboard.writeText(window.location.href);
    }
    const [open, setOpen] = React.useState(false);
    const returnTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
    };
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setOpen(false);
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
            <CT0002_PlansProvider>
                <CT0001_PlanGroupsProvider>
                    {itinerary.id && <OG0001_PlanGroupList itinerayId={itinerary.id} />}
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