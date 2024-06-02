import { ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext) => {
	return {
		expo: {
			name: 'Spelieve',
			owner: 'spelieve',
			slug: 'Spelieve',
			scheme: 'spelieve',
			version: '2.5.0',
			orientation: 'portrait',
			icon: './assets/favicon.png',
			userInterfaceStyle: 'light',
			splash: {
				image: './assets/splash.png',
				resizeMode: 'contain',
				backgroundColor: '#ffffff',
			},
			description: 'Traveling can be one of the happiest experiences in life, but preparing and managing schedules can be stressful. Spelieve helps reduce the hassle of travel, allowing travelers to focus on enjoying the essence of their journeys and make the most of their precious time!',
			updates: {
				fallbackToCacheTimeout: 0,
			},
			assetBundlePatterns: ['**/*'],
			ios: {
				supportsTablet: true,
				bundleIdentifier: 'com.spelieve',
				config: {
					googleMapsApiKey: process.env.GCP_API_KEY_IOS,
				},
				buildNumber: '12',
				googleServicesFile: './GoogleService-Info.plist',
			},
			android: {
				adaptiveIcon: {
					foregroundImage: './assets/favicon.png',
					backgroundColor: '#FFFFFF',
				},
				package: 'com.spelieve',
				config: {
					googleMaps: {
						apiKey: process.env.GCP_API_KEY_ANDROID,
					},
				},
				versionCode: 15, // TODO: 毎submitで変更の必要あり
				permissions: [],
				googleServicesFile: './google-services.json',
			},
			web: {
				shortName: 'Spelieve',
				backgroundColor: '#fafafa',
				favicon: './assets/favicon.png',
				lang: 'ja',
			},
			plugins: [
				[
					'expo-build-properties',
					{
						android: {
							compileSdkVersion: 33,
							targetSdkVersion: 33,
							buildToolsVersion: '33.0.0',
						},
						ios: {
							useFrameworks: 'static',
						},
					},
				],
				[
					'expo-image-picker',
					{
						photosPermission: 'Allow $(PRODUCT_NAME) to access your photos',
						cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
					},
				],
				'@react-native-firebase/app',
				'@react-native-firebase/perf',
				'@react-native-firebase/crashlytics',
				'./bin/react-native-maps-plugin',
			],
			extra: {
				eas: {
					projectId: 'fa9651c4-d3cd-4e16-8c54-34e4c4bc9f10',
				},
			},
		},
	};
};
