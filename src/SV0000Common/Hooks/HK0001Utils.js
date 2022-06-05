// *****************************************************************************
// 共通メソッドを定義する
// 下記のように宣言
// import * as useHK0001Utils from 'SV0000Common/Hooks/HK0001Utils'
// 下記のように利用
// useHK0001Utils.initialDate()
// *****************************************************************************

// Date
export const zeroDate = () => new Date(1970, 0, 1, 0, 0, 0);
export const milliSecondsADay = 24*60*60*1000