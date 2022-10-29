import { onSnapshot, DocumentSnapshot, collection, doc } from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode } from 'react';

import { ItineraryOneInterface, ItineraryOneValInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import db from '@/Itinerary/Endpoint/firestore';

export const ICT011ItineraryOne = createContext({} as ItineraryOneValInterface);

export function ICT011ItineraryOneProvider({ children }: { children: ReactNode }) {
	const [itineraryID, setItineraryID] = useState<string | undefined>(undefined);
	const [itineraryDocSnap, setItineraryDocSnap] = useState<DocumentSnapshot<ItineraryOneInterface> | undefined>(
		undefined,
	);

	useEffect(() => {
		if (itineraryID) {
			const unsubscribe = onSnapshot(
				doc(collection(db, Itineraries.modelName), itineraryID).withConverter(
					FirestoreConverter<Itineraries, ItineraryOneInterface>(
						Itineraries,
						(data) => data,
						(data) => data,
					),
				),
				(docSnap) => {
					setItineraryDocSnap(docSnap);
				},
			);
			return () => unsubscribe();
		}
	}, [itineraryID]);

	/* eslint react/jsx-no-constructed-context-values: 0 */
	const value: ItineraryOneValInterface = {
		itineraryDocSnap,
		setItineraryID,
	};
	return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>;
}
