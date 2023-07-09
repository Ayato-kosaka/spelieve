import dynamicLinks from '@react-native-firebase/dynamic-links';

export const buildItineraryPreviewDL = async (itineraryID: string): Promise<string> => {
	const previewPageLink = `https://www.spelieve.com/ItineraryPreview?itineraryID=${itineraryID}`;
	const link: string = await dynamicLinks().buildLink({
		link: previewPageLink,
		// domainUriPrefix is created in your Firebase console
		domainUriPrefix: 'https://spelieveuser.page.link', // TODO: 自分たちのインスタ投稿の時のdomainURLと別にしてる!!!
		ios: {
			bundleId: 'com.spelieve',
			appStoreId: 'id1660453134',
			fallbackUrl: previewPageLink,
		},
		android: {
			packageName: 'com.spelieve',
			fallbackUrl: previewPageLink,
		},
		navigation: {
			forcedRedirectEnabled: false, // アプリに直接飛ぶように設定
		},
	});

	return link;
};