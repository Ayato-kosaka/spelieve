export type DB0002ItineraryType = {
    id: string;
    title: string;
};

export const initItinerary = (id: string): DB0002ItineraryType => {
    const itinerary: DB0002ItineraryType = {
        id: id,
        title: '',
    };
    return itinerary;
}