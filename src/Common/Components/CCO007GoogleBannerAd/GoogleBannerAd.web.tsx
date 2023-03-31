import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';

export const CCO007GoogleBannerAd = () =>
	ENV.LOGGER ? (
		<View>
			<Text>{i18n.t('Advertisement Area')}</Text>
		</View>
	) : (
		// <Adsense
		// 	client="ca-pub-xxx" // TODO: 広告審査通過後に設定
		// 	slot="xxxxxxxxx" // TODO: 広告審査通過後に設定
		// />
		<View />
	);
