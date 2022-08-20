import db from '../../fireB/firestore'
import { doc, collection, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';
import type { DB0004PlansType as collectionType } from '../types/DB0004PlansType';
import { initPlan as initCollection } from '../types/DB0004PlansType';

const collectionName = 'Plans';
const parentCollection = collection(db, DB0002Itineraries.collectionName)
const collectionRef = (itineraryID: collectionType['itineraryID']) => collection(parentCollection, itineraryID, collectionName)

// HACK: エラーが出るが、設計変更したからいらない
// const toDate = (span: Date | string) => {
//     ( span instanceof Date) ? span : (span ? span.toDate() : HK0001Utils.initialDate())
// }

export const readAll = async (itineraryID: collectionType['itineraryID']): Promise<collectionType[]> => {
    const querySnapshot = await getDocs(collectionRef(itineraryID));
    return (querySnapshot.docs.map((doc) => {
        return { ...doc.data(), span: doc.data().span.toDate() } as collectionType; // HACK：[要検討]ここでDate型に変更しておかないといけない,一時的に型アサーションで回避
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
