// *****************************************************************************
// 共通メソッドを定義する
// 下記のように宣言
// import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'
// 下記のように利用
// CHK001Utils.initialDate()
// *****************************************************************************

import { useEffect, useState } from 'react';
import { Dimensions, Image, Platform } from 'react-native';

import { CHK006GoogleAnalytics } from './CHK006GoogleAnalytics/GoogleAnalytics';
import i18n from './i18n-js';

import { ENV } from '@/ENV';

/** **********************************************************************************************
 * console log を表示する
 * ※ ESLintで検出されなくなるので不必要に使わない
 *********************************************************************************************** */
export const Logger = (funcNm: string, variantNm: string, value: any) => {
	if (ENV.LOGGER) {
		// eslint-disable-next-line no-console
		console.log('debug', funcNm, variantNm, value); // JSON.stringify(value, null, '\t') は コンソールが見にくくなる
	}
	CHK006GoogleAnalytics.sendAnalyticsLogEvent('CHK001Utils_Logger', { funcNm, variantNm });
};

export const consoleError = (funcNm: string, variantNm: string, value: any) => {
	if (ENV.LOGGER) {
		// eslint-disable-next-line no-console
		console.log('error', funcNm, variantNm, value); // JSON.stringify(value, null, '\t') は コンソールが見にくくなる
	}
};

export const useGetImageRatio = (uri: string | undefined) => {
	const [aspectRatio, setAspectRatio] = useState(0);
	useEffect(() => {
		const getSize = async () => {
			if (uri) {
				setAspectRatio(
					await new Promise<number>((resolve, reject) => {
						Image.getSize(uri, (originalWidth, originalHeight) => {
							resolve(originalWidth / originalHeight);
						});
					}),
				);
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		getSize();
	}, [uri]);

	return {
		aspectRatio,
	};
};

export const getWindowWidth = () => {
	if (Platform.OS === 'web') {
		return Dimensions.get('window').width < 450 ? Dimensions.get('window').width : 450;
	}
	return Dimensions.get('window').width;
};

export const getDayCountString = (day: number): string => {
	switch (i18n.locale) {
		case 'en':
			return `Day ${day}`;
		case 'ja':
			return `${day}日目`;
		default:
			return '';
	}
};
