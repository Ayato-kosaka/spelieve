import db from '../fireB/firestore'
import { doc, collection, getDocs, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import * as DB0002Itineraries from 'SV0001Itinerary/Utils/api/DB0002Itineraries';


const collectionName = 'Plans';
const parentCollection = collection(db, DB0002Itineraries.collectionName)
const collectionRef = (itineraryId) => collection(parentCollection, itineraryId, collectionName)

const dataHash = (id, itineraryId, data) => {
    if (!id) { return }
    return ({
        'id': id,
        'itineraryId': itineraryId,
        ...bodyHash(data)
    });
}

const bodyHash = (data) => {
    return ({
        'title': data.title || '',
        'span': (data.span instanceof Date) ? data.span : (data.span ? data.span.toDate() : new Date(1970, 1, 1, 0, 0, 0)),
    });
}


export const readAll = async (itineraryId) => {
    const querySnapshot = await getDocs(collectionRef(itineraryId));
    return (querySnapshot.docs.map((doc) =>
        dataHash(doc.id, itineraryId, doc.data())
    ));
}

export const create = async (itineraryId) => {
    let docRef = await addDoc(collectionRef(itineraryId), bodyHash({}));
    return (dataHash(docRef.id, itineraryId, {}));
}

export const update = async (data) => {
    await setDoc(doc(collectionRef(data.itineraryId), data.id), bodyHash(data), { merge: true });
}

export const deleteData = async (data) => {
    await deleteDoc(doc(collectionRef(data.itineraryId), data.id));
}
