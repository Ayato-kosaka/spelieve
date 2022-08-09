import db from '../fireB/firestore'
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import type { DB0002ItinerariesType as collectionType } from 'SV0001Itinerary/Utils/types/DB0002ItinerariesType';
import { initItinerary as initCollection } from 'SV0001Itinerary/Utils/types/DB0002ItinerariesType';

export const collectionName = 'Itineraries';
const collectionRef = collection(db, collectionName);

export const read = async (id: collectionType["id"]): Promise<collectionType | undefined> => {
    const docSnap = await getDoc(doc(collectionRef, id));
    if (docSnap.exists()) {
        const collection = docSnap.data() as collectionType; // 一時的に型アサーションで回避
        return collection;
    } else {
        return undefined;
    }
}

export const readAll = async (): Promise<collectionType[]> => {
    const querySnapshot = await getDocs(collectionRef);
    return (querySnapshot.docs.map((doc) => {
        return doc.data() as collectionType
    }));
}

export const create = async (): Promise<collectionType> => {
    let docRef = await addDoc(collectionRef, {});
    return initCollection(docRef.id);
}

export const update = async (collection: collectionType) => {
    await setDoc(doc(collectionRef, collection.id), collection, { merge: true });
}

export const deleteData = async (collection: collectionType) => {
    await deleteDoc(doc(collectionRef, collection.id));
}