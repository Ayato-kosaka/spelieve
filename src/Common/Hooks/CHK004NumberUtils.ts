// import * as CHK004NumberUtils from '@/Common/Hooks/CHK004NumberUtils'

export const getDigitVal = (num: number, about: number) => Math.floor((num / (10 ** about / 10)) % 10);
