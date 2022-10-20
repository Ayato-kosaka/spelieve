import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { IDB003PlansInterface } from '@/Itinerary/Models/IDB003Plans';
import { ICT031PlansMapInterface } from './PlansInterface';
import { ICT031PlansMapBuild } from './PlansBuild';

/**
* Export a FirestoreDataConverter to transform ICT031PlansMap into Firestore data.
*/
export const ICT031PlansMapConverter = (): FirestoreDataConverter<ICT031PlansMapInterface> => ({
    /**
    * Convert ICT031PlansMap before be saved to Firestore.
    */
    toFirestore: (data: ICT031PlansMapInterface): IDB003PlansInterface => {
        return {
            title: data.title,
            span: Timestamp.fromDate(data.span),
        }
    },
    
    /**
    * Convert the data from Firestore to match ICT031PlansMap.
    */
    fromFirestore: (snapshot: QueryDocumentSnapshot<IDB003PlansInterface>): ICT031PlansMapInterface => {
        const initData: ICT031PlansMapInterface = ICT031PlansMapBuild();
        return {
            title: snapshot.data().title || initData.title,
            span: snapshot.data().span.toDate() || initData.span,
            startTime: initData.startTime,
        }
    }
});