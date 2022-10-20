import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { IDB001ItinerariesInterface } from '@/Itinerary/Models/IDB001Itineraries';
import { ICT011ItineraryOneInterface } from './ItinerariesInterface';
import { ICT011ItineraryOneBuild } from './ItinerariesBuild';

/**
* Export a FirestoreDataConverter to transform ICT011ItineraryOne into Firestore data.
*/
export const ICT011ItineraryOneConverter = (): FirestoreDataConverter<ICT011ItineraryOneInterface> => ({
    /**
    * Convert ICT011ItineraryOne before be saved to Firestore.
    */
    toFirestore: (data: ICT011ItineraryOneInterface): IDB001ItinerariesInterface => {
        return {
            title: data.title,
        }
    },
    
    /**
    * Convert the data from Firestore to match ICT011ItineraryOne.
    */
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB001ItinerariesInterface>): ICT011ItineraryOneInterface => {
        const initData: ICT011ItineraryOneInterface = ICT011ItineraryOneBuild();
        return {
            title: snapshot.data().title || initData.title,
        }
    }
});