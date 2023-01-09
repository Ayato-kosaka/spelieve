import { setDoc } from 'firebase/firestore';
import { useState, useContext, useEffect, useCallback } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

import { ItineraryCoverPropsInterface, ItineraryOneInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';

export function IPA002ItineraryCoverController({ itineraryID }: ItineraryCoverPropsInterface) {
	const [pageItinerary, setPageItinerary] = useState<ItineraryOneInterface | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [tagSearchText, setTagSearchText] = useState<string>('');
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
					newRepresentativeStartDateTime.setDate(newRepresentativeStartDateTime.getDate() + planGroup.dayNumber - 1);
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

	const onTagSearchTextChanged = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>): void => {
		setTagSearchText(e.nativeEvent.text);
	}, []);

	const onTagSearchTextBlur = useCallback(() => {
		if (!itineraryDocSnap || !pageItinerary || tagSearchText === '') {
			return;
		}
		const newTags = [...pageItinerary.tags];
		newTags.push(tagSearchText);
		setTagSearchText('');
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setDoc(itineraryDocSnap.ref, { tags: newTags }, { merge: true });
	}, [itineraryDocSnap, pageItinerary, tagSearchText]);

	const deleteTag = useCallback(
		(index: number): void => {
			if (!itineraryDocSnap || !pageItinerary) {
				return;
			}
			const newTags: string[] = [...pageItinerary.tags];
			newTags.splice(index, 1);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			setDoc<ItineraryOneInterface>(itineraryDocSnap.ref, { tags: newTags }, { merge: true });
		},
		[itineraryDocSnap, pageItinerary],
	);

	const shouldNavigate: boolean = !itineraryID || (!!itineraryDocSnap && !itineraryDocSnap.exists());

	return {
		pageItinerary,
		updateItinerary,
		handleOnChange,
		tagSearchText,
		onTagSearchTextChanged,
		onTagSearchTextBlur,
		deleteTag,
		shouldNavigate,
		isLoading,
		setPageItinerary,
	};
}
