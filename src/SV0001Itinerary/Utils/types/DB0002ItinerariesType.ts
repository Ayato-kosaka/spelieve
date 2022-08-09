export type DB0002ItinerariesType = {
    readonly id: string;
    title: string;
};

export const initItinerary = (id: DB0002ItinerariesType['id']): DB0002ItinerariesType => {
    const itinerary: DB0002ItinerariesType = {
        id: id,
        title: '',
    };
    return itinerary;
};