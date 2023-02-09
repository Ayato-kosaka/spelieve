import { Adsense } from '@ctrl/react-adsense';
import React from 'react';
import { View } from 'react-native';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';

export const GoogleBannerAd = () =>
	ENV.LOGGER ? (
		<View>{i18n.t('Advertisement Area')}</View>
	) : (
		<Adsense
			client="ca-pub-xxx" // TODO: 広告審査通過後に設定
			slot="xxxxxxxxx" // TODO: 広告審査通過後に設定
		/>
	);
