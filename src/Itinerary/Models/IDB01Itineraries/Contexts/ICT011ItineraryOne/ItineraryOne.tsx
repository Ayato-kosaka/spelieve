import { collection, doc, onSnapshot, DocumentSnapshot, addDoc } from 'firebase/firestore';
import { useState, createContext, useEffect, useMemo } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	ItineraryOneInterface,
	ItineraryOneProviderPropsInterface,
	ItineraryOneValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';

import { ICT011ItineraryOneConverter } from './ItinerariesConverter';

import db from '@/Itinerary/Endpoint/firestore';

export const ICT011ItineraryOne = createContext({} as ItineraryOneValInterface);

export function ICT011ItineraryOneProvider({ parentDocRef, children, id }: ItineraryOneProviderPropsInterface) {
	const [itineraryDocSnap, setItineraryDocSnap] = useState<DocumentSnapshot<ItineraryOneInterface> | null>(null);

	const collectionRef = useMemo(
		() =>
			parentDocRef
				? collection(parentDocRef, Itineraries.modelName).withConverter(ICT011ItineraryOneConverter())
				: collection(db, Itineraries.modelName).withConverter(ICT011ItineraryOneConverter()),
		[parentDocRef],
	);

	useEffect(() => {
		const unsubscribe = onSnapshot(doc(collectionRef, id), (docSnap) => {
			if (!docSnap.exists()) {
				/* eslint @typescript-eslint/no-floating-promises: 0 */
				addDoc<ItineraryOneInterface>(collectionRef, { title: '', caption: '' });
			} else {
				setItineraryDocSnap(docSnap);
			}
		});
		return () => unsubscribe();
	}, [collectionRef, id]);

	if (!itineraryDocSnap) {
		return <ActivityIndicator animating />;
	}

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: ItineraryOneValInterface = {
		itineraryDocSnap,
	};
	return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>;
}
