/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { utils } from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { LinkingOptions } from '@react-navigation/native';
import { createURL } from 'expo-linking';
import { Linking } from 'react-native';

import { Weaken } from '../Hooks/CHK003TypeScript';

import {
	ItineraryStackParamList,
	ItineraryTopTabParamList,
	PlaceStackParamList,
	RootStackParamList,
	BottomTabNavigatorParamList,
	ThumbnailStackParamList,
} from './NavigationInterface';

//  {
//     prefixes: [ENV.HOST_NAME_WEB],
// }

const ItineraryTopTabScreenProps: Weaken<ItineraryTopTabParamList, keyof ItineraryTopTabParamList> = {
	ItineraryEdit: 'ItineraryEdit',
	ItineraryPreview: 'ItineraryPreview',
};

const ItineraryStackScreens: Weaken<ItineraryStackParamList, keyof ItineraryStackParamList> = {
	ItineraryTopTabNavigator: {
		screens: ItineraryTopTabScreenProps,
	},
	HelloSpelieve: 'HelloSpelieve',
};

const PlaceStackScreens: Weaken<PlaceStackParamList, keyof PlaceStackParamList> = {
	PPA001Places: 'PPA001Places',
	PPA002Place: 'PPA002Place',
};

const BottomTabNavigatorScreens: Weaken<BottomTabNavigatorParamList, keyof BottomTabNavigatorParamList> = {
	Itinerary: {
		screens: ItineraryStackScreens,
	},
	Place: {
		screens: PlaceStackScreens,
	},
};

const ThumbnailStackScreens: Weaken<ThumbnailStackParamList, keyof ThumbnailStackParamList> = {
	TPA001ThumbnailEditor: 'ThumbnailEditor',
	TPA002ThumbnailTemplate: 'ThumbnailTemplate',
};

const RootStackScreens: Weaken<RootStackParamList, keyof RootStackParamList> = {
	BottomTabNavigator: {
		screens: BottomTabNavigatorScreens,
	},
	ThumbnailPageNavigator: {
		screens: ThumbnailStackScreens,
	},
	Modal: 'modal',
	EditPlan: 'EditPlan',
	NotFound: '*',
};

const config = {
	screens: RootStackScreens,
};

export const LinkingConfiguration: LinkingOptions<RootStackParamList> = {
	prefixes: [createURL('/'), 'https://www.spelieve.com'],
	// Custom function to get the URL which was used to open the app
	async getInitialURL() {
		// First, you would need to get the initial URL from your third-party integration
		// The exact usage depend on the third-party SDK you use
		// For example, to get the initial URL for Firebase Dynamic Links:
		const { isAvailable } = utils().playServicesAvailability;

		if (isAvailable) {
			const initialLink = await dynamicLinks().getInitialLink();

			if (initialLink) {
				return initialLink.url;
			}
		}

		// As a fallback, you may want to do the default deep link handling
		const url = await Linking.getInitialURL();

		return url;
	},

	// Custom function to subscribe to incoming links
	subscribe(listener) {
		// Listen to incoming links from Firebase Dynamic Links
		const unsubscribeFirebase = dynamicLinks().onLink(({ url }) => {
			listener(url);
		});

		// Listen to incoming links from deep linking
		const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
			listener(url);
		});

		return () => {
			// Clean up the event listeners
			unsubscribeFirebase();
			linkingSubscription.remove();
		};
	},
	config,
};

// *********
/**
 * https://reactnavigation.org/docs/configuring-links
 */
// export const universalLinkHandles = {
// 	screens: {
// 	  Main: {
// 		screens: {
// 		  SearchTeachersNavigator: {
// 			initialRouteName: 'IndexScreen',  // HelloSpelieveになる
// 			screens: searchTeacherScreens,
// 		  },
// 		},
// 	  },
// 	},
//   } as LinkingOptions<Routes>['config'];

//   const searchTeacherScreens: Partial<
// 	Record<keyof SearchTeacherRoutes, PathConfig<SearchTeacherRoutes> | '*'>
//   > = {
// 	// TeacherDetailというScreen ComponentはteacherIdというPropsを必要としている
// 	// Component側ではprops.route.params.teacherIdでアクセス可能
// 	TeacherDetail: {
// 	  path: 'teacher/:teacherId',
// 	  exact: true,
// 	},
// 	SearchResult: {
// 	  path: 'articles/:categoryId',
// 	  exact: true,
// 	  parse: {
// 		categoryId: (categorySlug: string) => findCategoryFromMaster(categorySlug).id,
// 	  },
// 	  stringify: {
// 		categoryId: (id: number) => findCategoryById(id).slug,
// 	  },
// 	},
// 	// 以下略
// 	// 見つからなかったらトップに戻す
// 	IndexScreen: '*',
//   };
