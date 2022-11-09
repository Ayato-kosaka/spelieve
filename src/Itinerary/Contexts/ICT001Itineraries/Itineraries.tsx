import { collection, doc, onSnapshot, addDoc, DocumentReference, DocumentSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode } from 'react';
import { ActivityIndicator } from 'react-native-paper';

import { ICT001ItinerariesBuild } from './ItinerariesBuild';
import { ICT001ItinerariesConverter } from './ItinerariesConverter';
import { ICT001ItinerariesInterface } from './ItinerariesInterface';

import db from '@/Itinerary/Endpoint/firestore';
import { collectionName } from '@/Itinerary/Models/IDB001Itineraries';

/**
 * Define value interface of useContext(ICT001Itineraries).
 */
interface ICT001ItinerariesValInterface {
	documentSnapshot: DocumentSnapshot<ICT001ItinerariesInterface>;
	create: () => Promise<DocumentReference>;
}
export const ICT001Itineraries = createContext({} as ICT001ItinerariesValInterface);

/**
 * Export Provider of ICT001Itineraries.
 */
interface ICT001ItinerariesProviderPropsInterface {
	parentDocRef?: DocumentReference;
	children: ReactNode;
	id: string;
}

export const ICT001ItinerariesProvider = ({ parentDocRef, children, id }: ICT001ItinerariesProviderPropsInterface) => {
	const [documentSnapshot, setDocumentSnapshot] = useState<ICT001ItinerariesValInterface['documentSnapshot'] | null>(
		null,
	);

	const collectionRef = parentDocRef
		? collection(parentDocRef, collectionName).withConverter(ICT001ItinerariesConverter())
		: collection(db, collectionName).withConverter(ICT001ItinerariesConverter());

	useEffect(() => {
		const fetchData = async () => {
			const unsubscribe = onSnapshot(doc(collectionRef, id), (documentSnapshot) => {
				if (!documentSnapshot.exists()) {
					create();
				} else {
					setDocumentSnapshot(documentSnapshot);
				}
			});
		};
		fetchData();
	}, [parentDocRef, id]);

	const create: ICT001ItinerariesValInterface['create'] = async () =>
		addDoc<ICT001ItinerariesInterface>(collectionRef, ICT001ItinerariesBuild());

	if (!documentSnapshot) {
		return <ActivityIndicator animating />;
	}

	const value: ICT001ItinerariesValInterface = {
		documentSnapshot,
		create,
	};
	return <ICT001Itineraries.Provider value={value}>{children}</ICT001Itineraries.Provider>;
};
