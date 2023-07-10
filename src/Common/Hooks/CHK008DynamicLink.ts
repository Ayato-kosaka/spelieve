import dynamicLinks from '@react-native-firebase/dynamic-links';

export const buildItineraryPreviewDL = async (urlLink: string): Promise<string> => {
	const link: string = await dynamicLinks().buildLink({
		link: urlLink,
		// domainUriPrefix is created in your Firebase console
		domainUriPrefix: 'https://spelieveuser.page.link',
		ios: {
			bundleId: 'com.spelieve',
			appStoreId: 'id1660453134',
			fallbackUrl: urlLink,
		},
		android: {
			packageName: 'com.spelieve',
			fallbackUrl: urlLink,
		},
		navigation: {
			forcedRedirectEnabled: false, // アプリに直接飛ぶように設定
		},
	});

	return link;
};
