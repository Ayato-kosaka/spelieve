import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { IDB001ItinerariesInterface } from '@/Itinerary/Models/IDB001Itineraries';
import { ICT001ItinerariesInterface } from './ItinerariesInterface';
import { ICT001ItinerariesBuild } from './ItinerariesBuild';

/**
* Export a FirestoreDataConverter to transform ICT001Itineraries into Firestore data.
*/
export const ICT001ItinerariesConverter = (): FirestoreDataConverter<ICT001ItinerariesInterface> => ({
    /**
    * Convert ICT001Itineraries before be saved to Firestore.
    */
    toFirestore: (data: ICT001ItinerariesInterface): IDB001ItinerariesInterface => {
        return {
            title: data.title,
        }
    },
    
    /**
    * Convert the data from Firestore to match ICT001Itineraries.
    */
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB001ItinerariesInterface>): ICT001ItinerariesInterface => {
        const initData: ICT001ItinerariesInterface = ICT001ItinerariesBuild();
        return {
            title: snapshot.data().title || initData.title,
        }
    }
});