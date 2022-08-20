import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot } from 'firebase/firestore';
import { IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans'
import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'

import { ICT003PlansInterface } from './PlansInterface';


export const ICT003PlansConverter = (): FirestoreDataConverter<ICT003PlansInterface> => ({
    toFirestore: (data: ICT003PlansInterface): IDB003PlansInterface => {
      return {
          ...data, // 【課題】ICT003PlansInterface をそのまま IDB003PlansInterface に型変換しているのに、error が出ないのはなぜ？このままでは、startTimeがサーバに渡る。要検討。
      }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB003PlansInterface>): ICT003PlansInterface => {
      const data: IDB003PlansInterface = {
          title: snapshot.data().title,
          span: snapshot.data().span,
      };
      return {
          ...data,
          startTime: CHK001Utils.initialDate()
      }
    }
});
