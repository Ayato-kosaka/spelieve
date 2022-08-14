import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB002PlanGroupsInterface } from '@/Itinerary/Interfaces/IDB002PlanGroupsInterface'

import { ICT002PlanGroupsInterface } from './PlanGroupsInterface';


export const ICT002PlanGroupsConverter = (): FirestoreDataConverter<ICT002PlanGroupsInterface> => ({
    toFirestore: (data: ICT002PlanGroupsInterface): IDB002PlanGroupsInterface => {
      return {
          ...data,
          plans: data.plans.join()
      }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB002PlanGroupsInterface>): ICT002PlanGroupsInterface => {
      const data: IDB002PlanGroupsInterface = {
          plans: snapshot.data().plans,
          representativePlanID: snapshot.data().representativePlanID,
          representativeStartTime: snapshot.data().representativeStartTime,
      };
      return {
          ...data,
          plans: data.plans.split(',')
      }
    }
});
