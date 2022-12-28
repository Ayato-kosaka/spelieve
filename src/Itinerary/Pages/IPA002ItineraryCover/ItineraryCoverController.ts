import { setDoc } from 'firebase/firestore';
import { useState, useContext, useEffect, useCallback } from 'react';
import { TextInputChangeEventData } from 'react-native';

import {
	ItineraryCoverPropsInterface,
	ItineraryOneInterface,
	ItineraryCoverControllerInterface,
} from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT011ItineraryOne } from '@/Itinerary/Models/IDB01Itineraries/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Models/IDB02PlanGroups/Contexts/ICT021PlanGroupsList';

export function IPA002ItineraryCoverController({
	itineraryID,
}: ItineraryCoverPropsInterface): ItineraryCoverControllerInterface {
	const [pageItinerary, setPageItinerary] = useState<ItineraryOneInterface | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { setItineraryID, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { planGroupsQSnap } = useContext(ICT021PlanGroupsList);

	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/347 Itineray ロック機能実装

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		}
	}, [itineraryID, setItineraryID]);

	useEffect(() => {
		if (itineraryDocSnap?.exists()) {
			setPageItinerary(itineraryDocSnap.data());
			setIsLoading(false);
		}
	}, [itineraryDocSnap]);

	const updateItinerary = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc<ItineraryOneInterface>(itineraryDocSnap!.ref, { ...pageItinerary!, updatedAt: new Date() });
	}, [itineraryDocSnap, pageItinerary]);

	// pageItinerary.imageUrl を監視し、updateItinerary を実行する
	useEffect(() => {
		const itinerary = itineraryDocSnap?.data();
		if (itinerary && pageItinerary && itinerary.imageUrl !== pageItinerary.imageUrl) {
			updateItinerary();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageItinerary?.imageUrl]);

	// startDate を監視し、updateItinerary を実行する
	useEffect(() => {
		const itinerary = itineraryDocSnap?.data();
		if (itinerary && pageItinerary && itinerary.startDate.getTime() !== pageItinerary.startDate.getTime()) {
			planGroupsQSnap?.docs.forEach((planGroupDoc) => {
				const updatePlanGroup = async () => {
					const planGroup = planGroupDoc.data();
					const newRepresentativeStartDateTime = DateUtils.addition(
						pageItinerary?.startDate,
						planGroup.representativeStartDateTime,
						['Hours', 'Minutes', 'Seconds'],
					);
					newRepresentativeStartDateTime.setDate(newRepresentativeStartDateTime.getDate() + planGroup.dayNumber);
					await setDoc(
						planGroupDoc.ref,
						{ representativeStartDateTime: newRepresentativeStartDateTime },
						{ merge: true },
					);
				};
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				updatePlanGroup();
			});
			updateItinerary();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageItinerary?.startDate.getTime()]);

	const handleOnChange = useCallback(
		(column: keyof ItineraryOneInterface) =>
			({ nativeEvent }: { nativeEvent: TextInputChangeEventData }) => {
				setPageItinerary({ ...pageItinerary!, [column]: nativeEvent.text });
			},
		[pageItinerary],
	);

	const deleteTag = useCallback(
		(index: number): void => {
			const newTags: string[] = pageItinerary!.tags.splice(index, 1);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc<ItineraryOneInterface>(itineraryDocSnap!.ref, { tags: newTags }, { merge: true });
		},
		[itineraryDocSnap, pageItinerary],
	);

	const shouldNavigate: boolean = !itineraryID || (!!itineraryDocSnap && !itineraryDocSnap.exists());

	return {
		pageItinerary,
		updateItinerary,
		handleOnChange,
		deleteTag,
		shouldNavigate,
		isLoading,
		setPageItinerary,
	};
}
