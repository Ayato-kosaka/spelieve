import { collection, query, onSnapshot, addDoc, DocumentReference, QueryDocumentSnapshot } from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode } from 'react';

import { ICT031PlansMapBuild } from './PlansBuild';
import { ICT031PlansMapConverter } from './PlansConverter';
import { ICT031PlansMapInterface } from './PlansInterface';

import db from '@/Itinerary/Endpoint/firestore';
import { collectionName } from '@/Itinerary/Models/IDB003Plans';

/**
 * Define value interface of useContext(ICT031PlansMap).
 */
interface ICT031PlansMapValInterface {
	documentSnapshots: { [id: string]: QueryDocumentSnapshot<ICT031PlansMapInterface> };
	create: () => Promise<DocumentReference>;
}
export const ICT031PlansMap = createContext({} as ICT031PlansMapValInterface);

/**
 * Export Provider of ICT031PlansMap.
 */
interface ICT031PlansMapProviderPropsInterface {
	parentDocRef?: DocumentReference;
	children: ReactNode;
}
export function ICT031PlansMapProvider({ parentDocRef, children }: ICT031PlansMapProviderPropsInterface) {
	const [documentSnapshots, setDocumentSnapshots] = useState<ICT031PlansMapValInterface['documentSnapshots']>({});

	const collectionRef = parentDocRef
		? collection(parentDocRef, collectionName).withConverter(ICT031PlansMapConverter())
		: collection(db, collectionName).withConverter(ICT031PlansMapConverter());

	useEffect(() => {
		const fetchData = async () => {
			const unsubscribe = onSnapshot(query<ICT031PlansMapInterface>(collectionRef), (querySnapshot) => {
				setDocumentSnapshots((documentSnapshots) => {
					querySnapshot.docChanges().forEach((change) => {
						if (change.type === 'added') {
							documentSnapshots[change.doc.id] = change.doc;
						}
						if (change.type === 'modified') {
							documentSnapshots[change.doc.id] = change.doc;
						}
						if (change.type === 'removed') {
							delete documentSnapshots[change.doc.id];
						}
					});
					return { ...documentSnapshots };
				});
			});
		};
		fetchData();
	}, [parentDocRef]);

	const create: ICT031PlansMapValInterface['create'] = async () =>
		addDoc<ICT031PlansMapInterface>(collectionRef, ICT031PlansMapBuild());

	const value: ICT031PlansMapValInterface = {
		documentSnapshots,
		create,
	};
	return <ICT031PlansMap.Provider value={value}>{children}</ICT031PlansMap.Provider>;
}
