import db from '../fireB/firestore'
import { doc, collection, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';
import type { DB0004PlanType } from '../types/DB0004PlanType';
import { initPlan } from '../types/DB0004PlanType';

const collectionName = 'Plans';
const parentCollection = collection(db, DB0002Itineraries.collectionName)
const collectionRef = (itineraryID: string) => collection(parentCollection, itineraryID, collectionName)

export const readAll = async (itineraryID: string): Promise<DB0004PlanType[]> => {
    const querySnapshot = await getDocs(collectionRef(itineraryID));
    return (querySnapshot.docs.map((doc) => {
        const plan: DB0004PlanType = {
            id: doc.data().id,
            itineraryID: itineraryID,
            title: doc.data().title,
            span: doc.data().span.toDate(),
        };
        return plan;
    }));
}

export const create = async (itineraryID: string): Promise<DB0004PlanType> => {
    let docRef = await addDoc(collectionRef(itineraryID), {});
    const plan: DB0004PlanType = initPlan(docRef.id, itineraryID);
    return plan;
}

export const update = async (plan: DB0004PlanType) => {
    await setDoc(doc(collectionRef(plan.itineraryID), plan.id), plan, { merge: true });
}

export const deleteData = async (plan: DB0004PlanType) => {
    await deleteDoc(doc(collectionRef(plan.itineraryID), plan.id));
}
