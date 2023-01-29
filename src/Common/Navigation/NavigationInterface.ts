import { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
	EditPlanPropsInterface,
	ItineraryCoverPropsInterface,
	ItineraryEditPropsInterface,
	PlacePropsInterface,
	PlacesPropsInterface,
} from 'spelieve-common/lib/Interfaces';

/**
 * Root Stack の型定義
 */
export type RootStackParamList = {
	Root: NavigatorScreenParams<RootTabParamList> | undefined;
	Modal: undefined;
	NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
	RootStackParamList,
	Screen
>;

/**
 * Bottom Tab の型定義
 */
export type RootTabParamList = {
	Itinerary: NavigatorScreenParams<ItineraryStackParamList>;
	Place: NavigatorScreenParams<PlaceStackParamList>;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
	MaterialBottomTabScreenProps<RootTabParamList, Screen>,
	NativeStackScreenProps<RootStackParamList>
>;

/**
 * Itinerary Stack の型定義
 */
export type ItineraryStackParamList = {
	ItineraryCover: ItineraryCoverPropsInterface;
	ItineraryTopTabNavigator: NavigatorScreenParams<ItineraryTopTabParamList>;
	EditPlan: EditPlanPropsInterface;
	HelloSpelieve: Record<string, never>;
};

export type ItineraryStackScreenProps<Screen extends keyof ItineraryStackParamList> = CompositeScreenProps<
	NativeStackScreenProps<ItineraryStackParamList, Screen>,
	MaterialBottomTabScreenProps<RootTabParamList>
>;

/**
 * Itinerary Top Tab の型定義
 */
export type ItineraryTopTabParamList = {
	ItineraryEdit: ItineraryEditPropsInterface;
	ItineraryPreview: ItineraryEditPropsInterface;
};

export type ItineraryTopTabScreenProps<Screen extends keyof ItineraryTopTabParamList> = CompositeScreenProps<
	MaterialTopTabScreenProps<ItineraryTopTabParamList, Screen>,
	NativeStackScreenProps<ItineraryStackParamList>
>;

/**
 * Place Stack の型定義
 */
export type PlaceStackParamList = {
	PPA001Places: PlacesPropsInterface;
	PPA002Place: PlacePropsInterface;
};

export type PlaceStackScreenProps<Screen extends keyof PlaceStackParamList> = CompositeScreenProps<
	NativeStackScreenProps<PlaceStackParamList, Screen>,
	MaterialBottomTabScreenProps<RootTabParamList>
>;
