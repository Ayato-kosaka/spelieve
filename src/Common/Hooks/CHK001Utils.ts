// *****************************************************************************
// 共通メソッドを定義する
// 下記のように宣言
// import * as CHK001Utils from '@/Common/Hooks/CHK001Utils'
// 下記のように利用
// CHK001Utils.initialDate()
// *****************************************************************************

/** **********************************************************************************************
 * console log を表示する
 * ※ ESLintで検出されなくなるので不必要に使わない
 *********************************************************************************************** */
export const Logger = (funcNm: string, variantNm: string, value: any) => {
	if (process.env.NODE_ENV !== 'production') {
		// eslint-disable-next-line no-console
		console.log('debug', funcNm, variantNm, JSON.stringify(value, null, '\t'));
	}
};
