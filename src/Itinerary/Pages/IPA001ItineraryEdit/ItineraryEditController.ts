import { addDoc, setDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { TextInputChangeEventData } from 'react-native';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { Logger } from '@/Common/Hooks/CHK001Utils';
import { ItineraryTopTabScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICT011ItineraryOne } from '@/Itinerary/Contexts/ICT011ItineraryOne';
import { ItineraryOneInterface } from '@/Itinerary/Contexts/ICT011ItineraryOne/ItineraryOneIntereface';
import { ICT021PlanGroupsList } from '@/Itinerary/Contexts/ICT021PlanGroupsList';
import { ICT031PlansMap } from '@/Itinerary/Contexts/ICT031PlansMap';

export const IPA001ItineraryEditController = ({ route, navigation }: ItineraryTopTabScreenProps<'ItineraryEdit'>) => {
	const { setItineraryID, itineraryCRef, itineraryDocSnap } = useContext(ICT011ItineraryOne);
	const { planGroupsQSnap, createPlanGroup, planGroupsCRef } = useContext(ICT021PlanGroupsList);
	const { plansCRef } = useContext(ICT031PlansMap);

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { itineraryID, place_id, placeName, placeImage } = route.params;

	const createItinerary = useCallback(async () => {
		if (itineraryCRef) {
			Logger('IPA001ItineraryEditController', 'createItinerary', { itineraryCRef, plansCRef, planGroupsCRef });
			const itinerayDocRef = await addDoc(itineraryCRef, {
				startDate: ((d) => {
					d.setHours(0);
					d.setMinutes(0);
					d.setSeconds(0);
					return d;
				})(new Date()),
				textMap: {},
				storeUrlMap: {},
				caption: '',
				isImmutable: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			navigation.setParams({ itineraryID: itinerayDocRef.id });
		}
	}, [itineraryCRef, navigation, planGroupsCRef, plansCRef]);

	useEffect(() => {
		if (itineraryID) {
			setItineraryID(itineraryID);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			createItinerary();
		}
	}, [createItinerary, itineraryID, setItineraryID]);

	useEffect(() => {
		if (planGroupsQSnap?.empty) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			createPlanGroup({
				title: placeName || '',
				place_id,
				imageUrl: placeImage,
			});
		}
	}, [createPlanGroup, placeImage, placeName, place_id, planGroupsQSnap?.empty]);

	const [pageItinerary, setPageItinerary] = useState<ItineraryOneInterface | undefined>(undefined);

	useEffect(() => {
		if (itineraryDocSnap?.exists()) {
			setPageItinerary(itineraryDocSnap.data());
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

	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);
	const onPressThumbnail = useCallback(() => {
		if (!pageItinerary) {
			return;
		}
		setThumbnailItemMapper({
			aspectRatio: 1,
			textMap: pageItinerary.textMap,
			storeUrlMap: pageItinerary.storeUrlMap,
			onBack(thumbnailID, thumbnailItemMapper, imageUrl) {
				if (itineraryDocSnap) {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					setDoc<ItineraryOneInterface>(
						itineraryDocSnap.ref,
						{
							thumbnailID,
							imageUrl,
							textMap: thumbnailItemMapper.textMap,
							storeUrlMap: thumbnailItemMapper.storeUrlMap,
						},
						{ merge: true },
					);
				}
			},
		});
		navigation.navigate('ThumbnailPageNavigator', {
			screen: 'TPA001ThumbnailEditor',
			params: {
				fromThumbnailID: pageItinerary?.thumbnailID,
			},
		});
	}, [itineraryDocSnap, navigation, pageItinerary, setThumbnailItemMapper]);

	const onPlanPress = useCallback(
		(planGroupID: string, planID: string) => {
			navigation.navigate('EditPlan', {
				itineraryID,
				planGroupID,
				planID,
			});
		},
		[navigation, itineraryID],
	);

	return {
		pageItinerary,
		onPressThumbnail,
		setPageItinerary,
		handleOnChange,
		updateItinerary,
		onPlanPress,
	};
};
