import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB003PlansInterface } from '@/Itinerary/Interfaces/IDB003PlansInterface'

import { ICT003PlansInterface } from './PlansInterface';


export const ICT003PlansConverter = (): FirestoreDataConverter<ICT003PlansInterface> => ({
    toFirestore: (data: ICT003PlansInterface): IDB003PlansInterface => {
      return {
          ...data,
      }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB003PlansInterface>): ICT003PlansInterface => {
      const data: IDB003PlansInterface = {
          title: snapshot.data().title,
          span: snapshot.data().span,
      };
      return {
          ...data,
      }
    }
});
