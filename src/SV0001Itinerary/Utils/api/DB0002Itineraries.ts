import db from '../fireB/firestore'
import { doc, collection, getDoc, setDoc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import type { DB0002ItineraryType } from 'SV0001Itinerary/Utils/types/DB0002ItineraryType';
import { initItinerary } from 'SV0001Itinerary/Utils/types/DB0002ItineraryType';

export const collectionName = 'Itineraries';
const collectionRef = collection(db, collectionName);

export const read = async (id: DB0002ItineraryType["id"]): Promise<DB0002ItineraryType | undefined> => {
    try {
        let docSnap = await getDoc(doc(collectionRef, id));
        const itinerary = docSnap.data() as DB0002ItineraryType | undefined;
        return itinerary;
    } catch {
        return undefined;
    }
}

export const readAll = async (): Promise<DB0002ItineraryType[]> => {
    const querySnapshot = await getDocs(collectionRef);
    return (querySnapshot.docs.map((doc) => {
        const itinerary: DB0002ItineraryType = {
            id: doc.data().id,
            title: doc.data().title,
        };
        return itinerary;
    }));
}

export const create = async (): Promise<DB0002ItineraryType> => {
    let docRef = await addDoc(collectionRef, {});
    const itinerary: DB0002ItineraryType = initItinerary(docRef.id);
    return itinerary;
}

export const update = async (itinerary: DB0002ItineraryType) => {
    await setDoc(doc(collectionRef, itinerary.id), itinerary, { merge: true });
}

export const deleteData = async (itinerary: DB0002ItineraryType) => {
    await deleteDoc(doc(collectionRef, itinerary.id));
}