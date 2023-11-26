import { ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext) => {
	return {
		expo: {
			name: 'Spelieve ~旅のしおり簡単作成アプリ~',
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
			description: 'このしおりが私たちの道標。未来の思い出が詰まってる。',
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
				buildNumber: '9',
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
				versionCode: 12, // TODO: 毎submitで変更の必要あり
				permissions: [],
				googleServicesFile: './google-services.json',
				targetSdkVersion: 33,
			},
			web: {
				shortName: 'Spelieve',
				backgroundColor: '#fafafa',
				favicon: './assets/favicon.png',
				lang: 'ja',
			},
			plugins: [
				[
					'expo-image-picker',
					{
						photosPermission: 'Allow $(PRODUCT_NAME) to access your photos',
						cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
					},
				],
				[
					'expo-build-properties',
					{
						ios: {
							useFrameworks: 'static',
						},
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
