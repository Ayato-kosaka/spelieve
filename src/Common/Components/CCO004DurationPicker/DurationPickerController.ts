import { useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import {
	DurationPickerControllerInterface,
	DurationPickerPropsInterface,
	DurationPickerTimeInterface,
} from 'spelieve-common/lib/Interfaces';

import * as CHK004NumberUtils from '@/Common/Hooks/CHK004NumberUtils';

export const CCO004DurationPickerController = ({
	value,
	onBlur,
}: DurationPickerPropsInterface): DurationPickerControllerInterface => {
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [time, setTime] = useState<DurationPickerTimeInterface>({ hour: 0, min: 0 });

	useEffect(() => {
		setTime({
			hour: value.getHours(),
			min: value.getMinutes(),
		});
	}, [value]);

	// props の value: Date を string に変換する。但し、フォーカスの有無で表示形式を変更する
	const textInputValue = useMemo(() => {
		const hourString = String(time.hour);
		const minString = String(time.min);
		if (isFocused) {
			return `${hourString.padStart(2, '0')}:${minString.padStart(2, '0')}`;
		}
		if (time.hour === 0) {
			return `${minString}Min`;
		}
		return `${hourString}Hrs${minString}`;
	}, [isFocused, time]);

	const onFocus = (): void => {
		setIsFocused(true);
	};

	const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
		const { key } = e.nativeEvent;
		const newTime = { ...time };
		if (key === 'Backspace') {
			// Backspace が入力された場合、
			// 12:34 -> 01:23 のように右に1桁ずらす
			newTime.hour = CHK004NumberUtils.getDigitVal(time.hour, 2);
			newTime.min = CHK004NumberUtils.getDigitVal(time.hour, 1) * 10 + CHK004NumberUtils.getDigitVal(time.min, 2);
		} else if (!Number.isNaN(parseInt(key, 10))) {
			// 数値が入力された場合、
			// 12:34 -> 23:4X のように左に1桁ずらす
			newTime.hour = CHK004NumberUtils.getDigitVal(time.hour, 1) * 10 + CHK004NumberUtils.getDigitVal(time.min, 2);
			newTime.min = CHK004NumberUtils.getDigitVal(time.min, 1) * 10 + parseInt(key, 10);
		} else {
			return;
		}
		setTime({
			hour: newTime.hour >= 24 ? newTime.hour % 10 : newTime.hour,
			min: newTime.min >= 60 && newTime.min % 10 > 6 ? newTime.min % 10 : newTime.min,
		});
	};

	const textInputOnBlur = async () => {
		const newVal = new Date(value.getTime());
		newVal.setHours(time.hour, time.min);
		if (onBlur) {
			await onBlur(newVal);
		}
		setIsFocused(false);
	};

	return { textInputValue, onFocus, onKeyPress, textInputOnBlur };
};
