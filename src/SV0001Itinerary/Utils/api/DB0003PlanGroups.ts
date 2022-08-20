import db from '../../fireB/firestore'
import { doc, collection, getDocs, setDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';
import type { DB0003PlanGroupsType as collectionType } from '../types/DB0003PlanGroupsType';
import { initPlanGroup as initCollection } from '../types/DB0003PlanGroupsType';


const collectionName = 'PlanGroups';
const parentCollection = collection(db, DB0002Itineraries.collectionName)
const collectionRef = (itineraryID: collectionType['itineraryID']) => collection(parentCollection, itineraryID, collectionName)


export const readAll = async (itineraryID: collectionType['itineraryID']): Promise<collectionType[]> => {
    const querySnapshot = await getDocs(query(collectionRef(itineraryID), orderBy('representativeStartTime')));
    return (querySnapshot.docs.map((doc) => {
        return doc.data() as collectionType; // 一時的に型アサーションで回避
    }));
}

export const create = async (itineraryID: collectionType['itineraryID']): Promise<collectionType> => {
    let docRef = await addDoc(collectionRef(itineraryID), {});
    return initCollection(docRef.id, itineraryID);
}

export const update = async (collection: collectionType) => {
    await setDoc(doc(collectionRef(collection.itineraryID), collection.id), collection, { merge: true });
}

export const deleteData = async (collection: collectionType) => {
    await deleteDoc(doc(collectionRef(collection.itineraryID), collection.id));
}