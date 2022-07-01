// *****************************************************************************
// 共通メソッドを定義する
// 下記のように宣言
// import * as HK0001Utils from 'SV0000Common/Hooks/HK0001Utils'
// 下記のように利用
// HK0001Utils.initialDate()
// *****************************************************************************

// Date
export const initialDate = (): Date => new Date(1970, 0, 1, 0, 0, 0);
export const milliSecondsADay: number = 24*60*60*1000;
export const formatDateToTime = (date: Date, hourUnit: string = ':', minUnit: string =''): string => {
    let [hour, min]: Array<string> = [date.getHours(), date.getMinutes()]
        .map((x) => (String(x).padStart((!minUnit) ? 2 : 1, '0')));
    if(date.getHours() === 0 && minUnit !== ''){
        return (min + minUnit);
    } else {
        return (hour + hourUnit + (parseInt(min)!=0 || !minUnit ? min : ''));
    }
};