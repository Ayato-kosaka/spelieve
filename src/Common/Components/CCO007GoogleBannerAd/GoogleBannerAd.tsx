import React from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { ENV } from '@/ENV';

const ProductionAdUnitID: string = Platform.select<string>({
	ios: ENV.ADMOB_IOS_Banner_UNIT_ID,
	android: ENV.ADMOB_ANDROID_Banner_UNIT_ID,
})!;
const adUnitID = ENV.LOGGER ? TestIds.BANNER : ProductionAdUnitID;

export const CCO007GoogleBannerAd = () => (
	<BannerAd
		unitId={adUnitID}
		size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
		requestOptions={{
			requestNonPersonalizedAdsOnly: true,
		}}
	/>
);
