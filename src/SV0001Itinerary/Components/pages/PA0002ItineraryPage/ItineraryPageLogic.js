import { useEffect, useState } from 'react';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';
import { useParams } from 'react-router-dom';



export const usePA0002 = () => {
    const params = useParams();
    const [itinerary, setItinerary] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        let id = params.itineraryId //L23yI08p6zqiyJ9E6R5M
        let itinerary = await DB0002Itineraries.read(id);
        if (!itinerary) {
            itinerary = await DB0002Itineraries.create();
        }
        setItinerary(itinerary);
        setIsLoading(false);
        window.history.pushState(null, null, '/itineraries/' + itinerary.id);
    }, []);

    return {
        itinerary,
        setItinerary,
        isLoading,
    }
}
export default usePA0002;

export const useAlert = () => {
    const [open, setOpen] = useState(false);
    const copyURL = () => {
        setOpen(true);
        navigator.clipboard.writeText(window.location.href);
    }
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setOpen(false);
    }

    return {
        open,
        handleCloseAlert,
        copyURL,
    }
}


export const returnTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
