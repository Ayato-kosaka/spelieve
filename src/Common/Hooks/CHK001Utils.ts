// *****************************************************************************
// 共通メソッドを定義する
// 下記のように宣言
// import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'
// 下記のように利用
// CHK001Utils.initialDate()
// *****************************************************************************

import { useEffect, useState } from 'react';
import { Image } from 'react-native';

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
};

export const useGetImageRatio = (uri: string | undefined) => {
	const [aspectRatio, setAspectRatio] = useState(0);
	useEffect(() => {
		const getSize = async () => {
			if (uri) {
				setAspectRatio(
					await new Promise<number>((resolve, reject) => {
						Image.getSize(uri, (originalWidth, originalHeight) => {
							resolve(originalHeight / originalWidth);
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
