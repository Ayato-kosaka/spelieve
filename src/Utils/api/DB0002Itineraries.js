import db from "Components/fireB/firestore"
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc } from "firebase/firestore";


export const collectionName = 'Itineraries';
const collectionRef = () => db.collection(collectionName);

const dataHash = (id, data) =>{
    if(!id){ return }
    return({
        'id': id,
        ...bodyHash(data)
    });
}

const bodyHash = (data) => {
    return({
        'title': data.title || '',
    });
}

export const read = async (id) => { 
    if(!id){ return }
    let docSnap = await collectionRef().doc(id).get();
    if(!docSnap.exists){ return }
    return(dataHash(id, docSnap.data()))
}

export const create = async () => { 
    let docRef = await addDoc(collectionRef, {});
    return(dataHash(docRef.id, {}));
}

export const update = async (data) => {
    await setDoc(collectionRef().doc(data.id), bodyHash(data), { merge: true });
}

export const deleteData = async (data) => {
    await deleteDoc(collectionRef().doc(data.id));
}