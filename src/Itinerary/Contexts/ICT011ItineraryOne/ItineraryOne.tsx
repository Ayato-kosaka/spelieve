import { onSnapshot, DocumentSnapshot, doc } from 'firebase/firestore';
import { useState, createContext, useEffect, ReactNode, useMemo } from 'react';

import { ICT011ItineraryOneController } from './ItineraryOneController';
import { ItineraryOneInterface, ItineraryOneValInterface } from './ItineraryOneIntereface';

import { consoleError, Logger } from '@/Common/Hooks/CHK001Utils';
import { storeRecentItinerary } from '@/Common/Pages/CPA001HelloSpelieve/HelloSpelieveRecentItineraryHook';

export const ICT011ItineraryOne = createContext({} as ItineraryOneValInterface);

export const ICT011ItineraryOneProvider = ({ children }: { children: ReactNode }) => {
	const [itineraryID, setItineraryID] = useState<string | undefined>(undefined);
	const [itineraryDocSnap, setItineraryDocSnap] = useState<DocumentSnapshot<ItineraryOneInterface> | undefined>(
		undefined,
	);

	// onSnapShotを使用するために取得している
	const { itineraryCRef } = ICT011ItineraryOneController();

	useEffect(() => {
		setItineraryDocSnap(undefined);
		if (itineraryID) {
			const unsubscribe = onSnapshot(doc(itineraryCRef, itineraryID), (docSnap) => {
				Logger('IDB01/Itineraries', 'read docSnap.id', docSnap.id);
				setItineraryDocSnap(docSnap);
				const data = docSnap.data()!;
				// R1: Itinerary 画面に遷移すると、itinearyId, updatedAt を更新する必要あり
				// R2: imageUrl を更新された際に、local storage の imageUrl も更新する必要あり
				// => 上記を考慮し、更新回数が多くなるが、onSnapshot の中で local storage への登録を行う
				storeRecentItinerary({ itineraryID: docSnap.id, imageUrl: data.imageUrl, updatedAt: new Date() }).catch((e) =>
					consoleError('ICT011ItineraryOne', 'useEffect.onSnapshot.storeRecentItinerary', e),
				);
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
