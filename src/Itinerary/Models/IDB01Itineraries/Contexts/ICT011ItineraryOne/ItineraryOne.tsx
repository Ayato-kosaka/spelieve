import { onSnapshot, DocumentSnapshot, collection, doc } from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode, useMemo } from 'react';

import { ItineraryOneInterface, ItineraryOneValInterface } from 'spelieve-common/lib/Interfaces/Itinerary';
import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';
import { FirestoreConverter } from 'spelieve-common/lib/Utils/FirestoreConverter';

import db from '@/Itinerary/Endpoint/firestore';

export const ICT011ItineraryOne = createContext({} as ItineraryOneValInterface);

export const ICT011ItineraryOneProvider = ({ children }: { children: ReactNode }) => {
	const [itineraryID, setItineraryID] = useState<string | undefined>(undefined);
	const [itineraryDocSnap, setItineraryDocSnap] = useState<DocumentSnapshot<ItineraryOneInterface> | undefined>(
		undefined,
	);

	const itineraryCRef = useMemo(
		() =>
			collection(db, Itineraries.modelName).withConverter(
				FirestoreConverter<Itineraries, ItineraryOneInterface>(
					Itineraries,
					(data) => data,
					(data) => data,
				),
			),
		[],
	);

	useEffect(() => {
		if (itineraryID) {
			const unsubscribe = onSnapshot(doc(itineraryCRef, itineraryID), (docSnap) => {
				setItineraryDocSnap(docSnap);
			});
			return () => unsubscribe();
		}
		return undefined;
	}, [itineraryCRef, itineraryID]);

	const value: ItineraryOneValInterface = useMemo(
		() => ({
			itineraryDocSnap,
			setItineraryID,
			itineraryCRef,
		}),
		[itineraryDocSnap, setItineraryID, itineraryCRef],
	);
	return <ICT011ItineraryOne.Provider value={value}>{children}</ICT011ItineraryOne.Provider>;
};
