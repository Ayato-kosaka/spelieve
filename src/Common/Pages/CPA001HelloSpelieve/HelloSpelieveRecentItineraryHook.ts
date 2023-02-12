import AsyncStorage from '@react-native-async-storage/async-storage';

import { Itineraries } from 'spelieve-common/lib/Models/Itinerary/IDB01/Itineraries';

export interface RecentItineraryInterface {
	itineraryID: string;
	imageUrl?: Itineraries['imageUrl'];
	textList0?: string;
	updatedAt: Date;
}

export type RecentItinerariesInterface = RecentItineraryInterface[];

const storageKey = 'recentItineraries';

const fromJSON = (json: string): RecentItinerariesInterface =>
	(JSON.parse(json) as { [key: string]: string }[]).map((data) => ({
		itineraryID: data.itineraryID,
		imageUrl: data.imageUrl,
		textList0: data.textList0,
		// Date.time で store されているため、Date 型に変換する
		updatedAt: new Date(parseInt(data.updatedAt, 10)),
	}));

const toJSON = (recentItineraries: RecentItinerariesInterface): string =>
	JSON.stringify(
		recentItineraries.map((recentItinerary) => ({
			itineraryID: recentItinerary.itineraryID,
			imageUrl: recentItinerary.imageUrl,
			textList0: recentItinerary.textList0,
			updatedAt: recentItinerary.updatedAt.getTime(),
		})),
	);

export const getRecentItineraries = async (): Promise<RecentItinerariesInterface> => {
	const json = await AsyncStorage.getItem(storageKey);
	if (json === null) {
		return [];
	}
	return fromJSON(json);
};

export const storeRecentItinerary = async (recentItinerary: RecentItineraryInterface): Promise<void> => {
	const recentItineraries = await getRecentItineraries();
	const target = recentItineraries.findIndex((item) => item.itineraryID === recentItinerary.itineraryID);
	if (target === -1) {
		recentItineraries.push(recentItinerary);
	} else {
		recentItineraries[target] = recentItinerary;
	}
	await AsyncStorage.setItem(storageKey, toJSON(recentItineraries));
};
