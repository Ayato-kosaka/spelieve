import { ConfigContext, ExpoConfig } from '@expo/config';

/**
 * This file is used for configuring Expo Prebuild generation, how a project loads in Expo Go, and the OTA update manifest.
 * @see {@link https://docs.expo.dev/workflow/configuration/}
 * @see {@link https://docs.expo.dev/versions/latest/config/app/}
 */
export default ({ config }: ConfigContext): {
	expo: ExpoConfig
} => {
	return {
		...config,
		expo: {
			name: 'Spelieve',
			description: 'Traveling can be one of the happiest experiences in life, but preparing and managing schedules can be stressful. Spelieve helps reduce the hassle of travel, allowing travelers to focus on enjoying the essence of their journeys and make the most of their precious time!',
			slug: 'Spelieve',
			owner: 'spelieve',
			currentFullName: '@spelieve/Spelieve',
			originalFullName: '@spelieve/Spelieve',
			privacy: 'public',
			// sdkVersion: '47.0.14', // package.json と一致するため省略
			// runtimeVersion @see {@link https://docs.expo.dev/versions/latest/config/app/#runtimeVersion}
			version: '2.5.1',
			platforms: ['ios', 'android', 'web'],
			githubUrl: 'https://github.com/Ayato-kosaka/spelieve',
			orientation: 'portrait',
			userInterfaceStyle: 'light',
			// backgroundColor @see {@link https://docs.expo.dev/versions/latest/config/app/#backgroundColor}
			// primaryColor @see {@link https://docs.expo.dev/versions/latest/config/app/#primaryColor}
			icon: './assets/favicon.png',
			// notification @see {@link https://docs.expo.dev/versions/latest/config/app/#notification}
			// androidStatusBar @see {@link https://docs.expo.dev/versions/latest/config/app/#androidStatusBar}
			// androidNavigationBar @see {@link https://docs.expo.dev/versions/latest/config/app/#androidNavigationBar}
			// developmentClient @see {@link https://docs.expo.dev/versions/latest/config/app/#developmentClient}
			scheme: 'spelieve',
			extra: {
				eas: {
					projectId: 'fa9651c4-d3cd-4e16-8c54-34e4c4bc9f10',
				},
			},
			updates: {
				enabled: true,
				checkAutomatically: 'ON_LOAD',
				fallbackToCacheTimeout: 0,
				// url @see {@link https://docs.expo.dev/versions/latest/config/app/#url}
				// codeSigningCertificate @see {@link https://docs.expo.dev/versions/latest/config/app/#codeSigningCertificate}
				// codeSigningMetadata @see {@link https://docs.expo.dev/versions/latest/config/app/#codeSigningMetadata}
				// requestHeaders @see {@link https://docs.expo.dev/versions/latest/config/app/#requestHeaders}
			},
			// locales @see {@link https://docs.expo.dev/versions/latest/config/app/#locales}
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
			],
			splash: {
				backgroundColor: '#ffffff',
				image: './assets/splash.png',
				resizeMode: 'contain',
			},
			// jsEngine @see {@link https://docs.expo.dev/versions/latest/config/app/#jsEngine}
			ios: {
				// publishManifestPath @see {@link https://docs.expo.dev/versions/latest/config/app/#publishManifestPath}
				// publishBundlePath @see {@link https://docs.expo.dev/versions/latest/config/app/#publishBundlePath}
				bundleIdentifier: 'com.spelieve',
				buildNumber: '14',
				// backgroundColor: '#ffffff', // Override 不要のため省略
				// icon: './assets/favicon.png', // Override 不要のため省略
				appStoreUrl: 'https://apps.apple.com/us/app/spelieve-travel-itinerary/id1660453134',
				// bitcode @see {@link https://docs.expo.dev/versions/latest/config/app/#bitcode}
				config: { // @see {@link https://docs.expo.dev/versions/latest/config/app/#config}
					googleMapsApiKey: process.env.GCP_API_KEY_IOS,
				},
				googleServicesFile: './GoogleService-Info.plist',
				supportsTablet: true,
				isTabletOnly: false,
				requireFullScreen: false,
				// userInterfaceStyle: 'light', // Override 不要のため省略
				// infoPlist @see {@link https://docs.expo.dev/versions/latest/config/app/#infoPlist}
				// entitlements @see {@link https://docs.expo.dev/versions/latest/config/app/#entitlements}
				// privacyManifests @see {@link https://docs.expo.dev/versions/latest/config/app/#privacyManifests}
				// associatedDomains @see {@link https://docs.expo.dev/versions/latest/config/app/#associatedDomains}
				// usesIcloudStorage @see {@link https://docs.expo.dev/versions/latest/config/app/#usesIcloudStorage}
				// usesAppleSignIn @see {@link https://docs.expo.dev/versions/latest/config/app/#usesAppleSignIn}
				// accessesContactNotes @see {@link https://docs.expo.dev/versions/latest/config/app/#accessesContactNotes}
				// splash @see {@link https://docs.expo.dev/versions/latest/config/app/#splash}
				// jsEngine @see {@link https://docs.expo.dev/versions/latest/config/app/#jsEngine}
				// runtimeVersion @see {@link https://docs.expo.dev/versions/latest/config/app/#runtimeVersion}
			},

			android: {
				// publishManifestPath @see {@link https://docs.expo.dev/versions/latest/config/app/#publishManifestPath}
				// publishBundlePath @see {@link https://docs.expo.dev/versions/latest/config/app/#publishBundlePath}
				package: 'com.spelieve',
				versionCode: 17, // TODO: 毎submitで変更の必要あり
				// backgroundColor: '#ffffff', // Override 不要のため省略
				// userInterfaceStyle: 'light', // Override 不要のため省略
				// icon: './assets/favicon.png', // Override 不要のため省略
				adaptiveIcon: {
					foregroundImage: './assets/favicon.png',
					// monochromeImage @see {@link https://docs.expo.dev/versions/latest/config/app/#monochromeImage}
					// backgroundImage @see {@link https://docs.expo.dev/versions/latest/config/app/#backgroundImage}
					backgroundColor: '#FFFFFF',
				},
				playStoreUrl: 'https://play.google.com/store/apps/details?id=com.spelieve',
				permissions: [],
				// blockedPermissions @see {@link https://docs.expo.dev/versions/latest/config/app/#blockedPermissions}
				googleServicesFile: './google-services.json',
				config: { // @see {@link https://docs.expo.dev/versions/latest/config/app/#config}
					googleMaps: {
						apiKey: process.env.GCP_API_KEY_ANDROID,
					},
				},
				// splash @see {@link https://docs.expo.dev/versions/latest/config/app/#splash}
				// intentFilters @see {@link https://docs.expo.dev/versions/latest/config/app/#intentFilters}
				// allowBackup @see {@link https://docs.expo.dev/versions/latest/config/app/#allowBackup}
				// softwareKeyboardLayoutMode @see {@link https://docs.expo.dev/versions/latest/config/app/#softwareKeyboardLayoutMode}
				// jsEngine @see {@link https://docs.expo.dev/versions/latest/config/app/#jsEngine}
				// runtimeVersion @see {@link https://docs.expo.dev/versions/latest/config/app/#runtimeVersion}
			},
			web: {
				output: 'single',
				favicon: './assets/favicon.png',
				name: 'Spelieve',
				shortName: 'Spelieve',
				lang: 'en',
				// scope @see {@link https://docs.expo.dev/versions/latest/config/app/#scope}
				// themeColor @see {@link https://docs.expo.dev/versions/latest/config/app/#themeColor}
				// description @see {@link https://docs.expo.dev/versions/latest/config/app/#description}
				// dir @see {@link https://docs.expo.dev/versions/latest/config/app/#dir}
				// display @see {@link https://docs.expo.dev/versions/latest/config/app/#display}
				// startUrl @see {@link https://docs.expo.dev/versions/latest/config/app/#startUrl}
				// orientation @see {@link https://docs.expo.dev/versions/latest/config/app/#orientation}
				backgroundColor: '#fafafa',
				// barStyle @see {@link https://docs.expo.dev/versions/latest/config/app/#barStyle}
				// preferRelatedApplications @see {@link https://docs.expo.dev/versions/latest/config/app/#preferRelatedApplications}
				// dangerous @see {@link https://docs.expo.dev/versions/latest/config/app/#dangerous}
				// splash @see {@link https://docs.expo.dev/versions/latest/config/app/#splash}
				// config @see {@link https://docs.expo.dev/versions/latest/config/app/#config}
				// bundler @see {@link https://docs.expo.dev/versions/latest/config/app/#bundler}
			},
			// experiments @see {@link https://docs.expo.dev/versions/latest/config/app/#experiments}
			// _internal @see {@link https://docs.expo.dev/versions/latest/config/app/#_internal}
			assetBundlePatterns: ['**/*'],
		}
	};
};
