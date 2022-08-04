import db from '../fireB/firestore'
import { doc, collection, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';
import type { DB0004PlanType } from '../types/DB0004PlanType';
import { initPlan } from '../types/DB0004PlanType';

const collectionName = 'Plans';
const parentCollection = collection(db, DB0002Itineraries.collectionName)
const collectionRef = (itineraryId: string) => collection(parentCollection, itineraryId, collectionName)

export const readAll = async (itineraryId: string): Promise<DB0004PlanType[]> => {
    const querySnapshot = await getDocs(collectionRef(itineraryId));
    return (querySnapshot.docs.map((doc) => {
        const plan: DB0004PlanType = {
            id: doc.data().id,
            itineraryId: itineraryId,
            title: doc.data().title,
            span: doc.data().span.toDate(),
        };
        return plan;
    }));
}

export const create = async (itineraryId: string): Promise<DB0004PlanType> => {
    let docRef = await addDoc(collectionRef(itineraryId), {});
    const plan: DB0004PlanType = initPlan(docRef.id, itineraryId);
    return plan;
}

export const update = async (plan: DB0004PlanType) => {
    await setDoc(doc(collectionRef(plan.itineraryId), plan.id), plan, { merge: true });
}

export const deleteData = async (plan: DB0004PlanType) => {
    await deleteDoc(doc(collectionRef(plan.itineraryId), plan.id));
}
