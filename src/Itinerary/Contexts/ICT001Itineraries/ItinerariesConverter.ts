import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB001ItinerariesInterface } from '@/Itinerary/Models/IDB001Itineraries/IDB001ItinerariesInterface';

import { ICT001ItinerariesInterface } from './ItinerariesInterface';


export const ICT001ItinerariesConverter = (): FirestoreDataConverter<ICT001ItinerariesInterface> => ({
    toFirestore: (data: ICT001ItinerariesInterface): IDB001ItinerariesInterface => {
      return {
          ...data,
      }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB001ItinerariesInterface>): ICT001ItinerariesInterface => {
      const data: ICT001ItinerariesInterface = {
          title: snapshot.data().title,
      };
      return {
          ...data,
      }
    }
});
