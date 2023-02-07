import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ENV } from '@/ENV';
import { Platform } from 'react-native';

const ProductionAdUnitID: string = Platform.select<string>({
  ios: ENV.ADMOB_IOS_Banner_UNIT_ID,
  android: ENV.ADMOB_ANDROID_Banner_UNIT_ID,
})!;
const adUnitID = __DEV__ ? TestIds.BANNER : ProductionAdUnitID;

export const GoogleBannerAd = () => {
  return (
    <BannerAd
      unitId={adUnitID}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}