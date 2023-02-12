import { ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext) => {
	return {
		expo: {
			name: 'Spelieve ~旅のしおり簡単作成アプリ~',
			owner: 'spelieve',
			slug: 'Spelieve',
			version: '2.0.0',
			orientation: 'portrait',
			icon: './assets/square-icon.png',
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
				buildNumber: '2',
				googleServicesFile: './GoogleService-Info.plist',
			},
			android: {
				adaptiveIcon: {
					foregroundImage: './assets/square-icon.png',
					backgroundColor: '#FFFFFF',
				},
				package: 'com.spelieve',
				config: {
					googleMaps: {
						apiKey: process.env.GCP_API_KEY_ANDROID,
					},
				},
				versionCode: 5, // TODO: 毎submitで変更の必要あり
				permissions: [],
				googleServicesFile: './google-services.json',
			},
			web: {
				shortName: 'Spelieve',
				backgroundColor: '#fafafa',
				favicon: './assets/square-icon.png',
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
			],
			extra: {
				eas: {
					projectId: 'fa9651c4-d3cd-4e16-8c54-34e4c4bc9f10',
				},
			},
		},
	};
};
