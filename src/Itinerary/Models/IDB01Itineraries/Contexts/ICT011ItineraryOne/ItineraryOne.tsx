import { collection, doc, onSnapshot, DocumentSnapshot, addDoc } from 'firebase/firestore';
import { useState, createContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	ItineraryOneInterface,
	ItineraryOneProviderPropsInterface,
	ItineraryOneValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';

import { ICT011ItineraryOneConverter } from './ItinerariesConverter';

import db from '@/Itinerary/Endpoint/firestore';

export const ICT011ItineraryOne = createContext({});

export function ICT011ItineraryOneProvider({ parentDocRef, children, id }: ItineraryOneProviderPropsInterface) {
	const [documentSnapshot, setDocumentSnapshot] = useState<DocumentSnapshot<ItineraryOneInterface> | null>(null);

	const collectionRef = parentDocRef
		? collection(parentDocRef, Itineraries.modelName).withConverter(ICT011ItineraryOneConverter())
		: collection(db, Itineraries.modelName).withConverter(ICT011ItineraryOneConverter());

	useEffect(() => {
		const unsubscribe = onSnapshot(doc(collectionRef, id), (docSnap) => {
			if (!docSnap.exists()) {
				addDoc<ItineraryOneInterface>(collectionRef, { title: '', caption: '' });
			} else {
				setDocumentSnapshot(docSnap);
			}
		});
		return () => unsubscribe();
	}, [collectionRef, id]);

	if (!documentSnapshot) {
		return <ActivityIndicator animating />;
	}

	const value: ItineraryOneValInterface = {
		itineraryDocSnap: documentSnapshot,
	};
	return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>;
}
