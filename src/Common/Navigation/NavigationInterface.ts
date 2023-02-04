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

import { ThumbnailEditorPropsInterface } from '@/Thumbnail/Pages/TPA001ThumbnailEditor/ThumbnailEditorInterface';

/**
 * Root Stack の型定義
 */
export type RootStackParamList = {
	BottomTabNavigator: NavigatorScreenParams<BottomTabNavigatorParamList> | undefined;
	ThumbnailPageNavigator: NavigatorScreenParams<ThumbnailStackParamList>;
	Modal: undefined;
	NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
	RootStackParamList,
	Screen
>;

/**
 * Thumbnail Stack の型定義
 */
export type ThumbnailStackParamList = {
	TPA001ThumbnailEditor: ThumbnailEditorPropsInterface;
};

export type ThumbnailStackScreenProps<Screen extends keyof ThumbnailStackParamList> = CompositeScreenProps<
	NativeStackScreenProps<ThumbnailStackParamList, Screen>,
	NativeStackScreenProps<RootStackParamList>
>;

/**
 * Bottom Tab の型定義
 */
export type BottomTabNavigatorParamList = {
	Itinerary: NavigatorScreenParams<ItineraryStackParamList>;
	Place: NavigatorScreenParams<PlaceStackParamList>;
};

export type BottomTabNavigatorScreenProps<Screen extends keyof BottomTabNavigatorParamList> = CompositeScreenProps<
	MaterialBottomTabScreenProps<BottomTabNavigatorParamList, Screen>,
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
	CompositeScreenProps<NativeStackScreenProps<BottomTabNavigatorParamList>, NativeStackScreenProps<RootStackParamList>>
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
	CompositeScreenProps<
		NativeStackScreenProps<ItineraryStackParamList>,
		CompositeScreenProps<
			NativeStackScreenProps<BottomTabNavigatorParamList>,
			NativeStackScreenProps<RootStackParamList>
		>
	>
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
	CompositeScreenProps<NativeStackScreenProps<BottomTabNavigatorParamList>, NativeStackScreenProps<RootStackParamList>>
>;
