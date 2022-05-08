import db from "Components/fireB/firestore"
import { doc, collection, getDoc, setDoc, addDoc } from "firebase/firestore";
import * as DB0002Itineraries from 'Utils/api/DB0002Itineraries';


const collectionName = 'PlanGroups';
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
        'plans': Array.isArray(data.plans) ? data.plans : (data.plans ? data.plans.split(",") : []),
        'representivePlanID': data.representivePlanID || '',
        'representiveStartTime': (data.representiveStartTime instanceof Date) ? data.representiveStartTime : new Date(1970, 1, 1, 0, 0, 0),
    });
}




export const readAll = async (itineraryId) => {
    const querySnapshot = await collectionRef(itineraryId).get()
    return (querySnapshot.docs.map((doc) =>
        dataHash(doc.id, itineraryId, doc.data())
    ));
}

export const create = async (itineraryId) => { 
    let docRef = await addDoc(collectionRef(itineraryId), bodyHash({}));
    return(dataHash(docRef.id, itineraryId, {}));
}

export const update = async (data) => {
    const setterConverter = (x) => ({...x, 'plans': x.join()});
    await setDoc(collectionRef(data.itineraryId).doc(data.id), setterConverter(bodyHash(data)), { merge: true });
}