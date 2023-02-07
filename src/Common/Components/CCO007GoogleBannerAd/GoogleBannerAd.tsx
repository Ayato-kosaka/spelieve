import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ENV } from '@/ENV';

const adUnitId: string = __DEV__ ? TestIds.BANNER : ENV.ADMOB_IOS_Banner_UNIT_ID;

export const GoogleBannerAd = () => {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}