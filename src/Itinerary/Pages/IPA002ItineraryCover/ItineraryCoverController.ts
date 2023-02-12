import { setDoc } from 'firebase/firestore';
import { useState, useContext, useEffect, useCallback } from 'react';
import { TextInputChangeEventData } from 'react-native';

import { ItineraryOneInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { ItineraryStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';

export function IPA002ItineraryCoverController({ route, navigation }: ItineraryStackScreenProps<'ItineraryCover'>) {
	const { itineraryID } = route.params;
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

	const shouldNavigate: boolean = !itineraryID || (!!itineraryDocSnap && !itineraryDocSnap.exists());

	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const onPressThumbnail = useCallback(() => {
		setThumbnailItemMapper({
			textMap: pageItinerary?.textMap,
			storeUrlMap: {
				sampleImage:
					'https://firebasestorage.googleapis.com/v0/b/spelieve-dev.appspot.com/o/12373bcd-013b-43d3-bbcf-f95c3d991edc?alt=media&token=91171ed7-7a92-439b-9c4b-a675cabe49bc',
			},
			onBack(thumbnailID, imageUrl) {
				if (itineraryDocSnap) {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					setDoc<ItineraryOneInterface>(itineraryDocSnap.ref, { thumbnailID, imageUrl }, { merge: true });
				}
			},
		});
		navigation.navigate('ThumbnailPageNavigator', {
			screen: 'TPA001ThumbnailEditor',
			params: {
				fromThumbnailID: pageItinerary?.thumbnailID,
			},
		});
	}, [itineraryDocSnap, navigation, pageItinerary?.textMap, pageItinerary?.thumbnailID, setThumbnailItemMapper]);

	return {
		pageItinerary,
		updateItinerary,
		handleOnChange,
		shouldNavigate,
		isLoading,
		setPageItinerary,
		onPressThumbnail,
	};
}
