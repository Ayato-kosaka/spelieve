import db from '../fireB/firestore'
import { doc, collection, getDocs, setDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';
import { DB0003PlanGroupType, initPlanGroup } from '../types/DB0003PlanGroupType';


const collectionName = 'PlanGroups';
const parentCollection = collection(db, DB0002Itineraries.collectionName)
const collectionRef = (itineraryId: string) => collection(parentCollection, itineraryId, collectionName)


export const readAll = async (itineraryId: string): Promise<DB0003PlanGroupType[]> => {
    const querySnapshot = await getDocs(query(collectionRef(itineraryId), orderBy('representiveStartTime')));
    return (querySnapshot.docs.map((doc) => {
        const planGroup: DB0003PlanGroupType = {
            id: doc.data().id,
            itineraryId: doc.data().itineraryId,
            plans: doc.data().plans.split(','),
            representativePlanId: doc.data().representativePlanId,
            representativeStartTime: doc.data().representativeStartTime.toDate(),
        };
        return planGroup;
    }));
}

export const create = async (itineraryId: string): Promise<DB0003PlanGroupType> => {
    let docRef = await addDoc(collectionRef(itineraryId), {});
    const planGroup: DB0003PlanGroupType = initPlanGroup(docRef.id, itineraryId);
    return planGroup;
}

export const update = async (planGroup: DB0003PlanGroupType) => {
    const setterConverter = (pg: DB0003PlanGroupType) => ({...pg, 'plans': pg.plans.join()}); 
    await setDoc(doc(collectionRef(planGroup.itineraryId), planGroup.id), setterConverter(planGroup), { merge: true });
}

export const deleteData = async (planGroup: DB0003PlanGroupType) =>{
    await deleteDoc(doc(collectionRef(planGroup.itineraryId), planGroup.id));
}