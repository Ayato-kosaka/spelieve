import { setDoc } from 'firebase/firestore';
import { useState, useContext, useEffect } from 'react';
import { TextInputChangeEventData } from 'react-native';

import { ItineraryCoverPropsInterface, ItineraryOneInterface } from 'spelieve-common/lib/Interfaces';

import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';

export function IPA002ItineraryCoverController({ itineraryID }: ItineraryCoverPropsInterface) {
	const [pageItinerary, setPageItinerary] = useState<ItineraryOneInterface | undefined>(undefined);
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

	useEffect(() => {
		if (itineraryDocSnap?.exists()) {
			setPageItinerary(itineraryDocSnap.data());
		}
	}, [itineraryDocSnap]);

	const updateItinerary = () => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc<ItineraryOneInterface>(itineraryDocSnap!.ref, { ...pageItinerary! });
	};

	const handleOnChange =
		(column: keyof ItineraryOneInterface) =>
		({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => {
			setPageItinerary({ ...pageItinerary!, [column]: nativeEvent.text });
		};

	const deleteTag = (index: number): void => {
		const newTags: string[] = pageItinerary!.tags.splice(index, 1);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc<ItineraryOneInterface>(itineraryDocSnap!.ref, { ...pageItinerary!, tags: newTags });
	};

	const shouldNavigate: boolean = !itineraryID || (!!itineraryDocSnap && !itineraryDocSnap.exists());

	const isLoading = !itineraryDocSnap;

	return {
		pageItinerary,
		updateItinerary,
		handleOnChange,
		deleteTag,
		shouldNavigate,
		isLoading,
	};
}
