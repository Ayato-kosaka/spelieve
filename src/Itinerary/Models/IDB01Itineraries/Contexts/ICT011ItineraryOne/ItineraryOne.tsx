import { onSnapshot, DocumentSnapshot, addDoc } from 'firebase/firestore';
import { useState, createContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import {
	ItineraryOneInterface,
	ItineraryOneProviderPropsInterface,
	ItineraryOneValInterface,
} from 'spelieve-common/lib/Interfaces/Itinerary';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

export const ICT011ItineraryOne = createContext({} as ItineraryOneValInterface);

export function ICT011ItineraryOneProvider({ docRef, children }: ItineraryOneProviderPropsInterface) {
	const [itineraryDocSnap, setItineraryDocSnap] = useState<DocumentSnapshot<ItineraryOneInterface> | null>(null);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			docRef.withConverter(
				FirestoreConverter<Itineraries, ItineraryOneInterface>(
					Itineraries,
					(data) => data,
					(data) => data,
				),
			),
			(docSnap) => {
				if (docSnap.exists()) {
					setItineraryDocSnap(docSnap);
				} else {
					/* eslint @typescript-eslint/no-floating-promises: 0 */
					addDoc<ItineraryOneInterface>(docSnap.ref.parent, { title: '', caption: '' });
				}
			},
		);
		return () => unsubscribe();
	}, [docRef]);

	if (!itineraryDocSnap) {
		return <ActivityIndicator animating />;
	}

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: ItineraryOneValInterface = {
		itineraryDocSnap,
	};
	return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>;
}
