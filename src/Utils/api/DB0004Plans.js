import db from "Components/fireB/firestore"
import { doc, collection, getDoc, setDoc, addDoc } from "firebase/firestore";
import * as DB0002Itineraries from 'Utils/api/DB0002Itineraries';


const collectionName = 'Plans';
const parentCollection = db.collection(DB0002Itineraries.collectionName)
const collectionRef = (itineraryId) => parentCollection.doc(itineraryId).collection(collectionName)

const dataHash = (id, itineraryId, data) =>{
    if(!id){ return }
    return({
        'id': id,
        'itineraryId': itineraryId,
        ...bodyHash(data)
    });
}

const bodyHash = (data) => {
    return({
        'title': data.title || '',
        'span': (data.span instanceof Date) ? data.span : new Date(1970, 1, 1, 0, 0, 0),
    });
}


export const readAll = async (itineraryId) => {
    const querySnapshot = await collectionRef(itineraryId).get()
    return (querySnapshot.docs.map((doc) =>
        dataHash(doc.id, itineraryId, doc.data())
    ));
}

export const create = async (itineraryId) => { 
    let docRef = await addDoc(collection(DB0002Itineraries.collectionName, itineraryId, collectionName), bodyHash({}));
    console.log("OK")
    return(dataHash(docRef.id, itineraryId, {}));
}

export const update = async (data) => {
    await setDoc(collectionRef(data.itineraryId).doc(data.id), bodyHash(data), { merge: true });
}