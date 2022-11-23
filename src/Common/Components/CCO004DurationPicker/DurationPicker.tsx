import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { TextInput } from 'react-native-paper';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import * as CHK004NumberUtils from '@/Common/Hooks/CHK004NumberUtils';

interface DurationPickerTimeInterface {
	hour: number;
	min: number;
}

export const CCO004DurationPicker = ({
	...props
}: Omit<ComponentProps<typeof TextInput>, 'value' | 'onBlur' | 'keyboardType'> & {
	value: Date;
	onBlur: (newVal: Date) => Promise<void> | void;
}) => {
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [time, setTime] = useState<DurationPickerTimeInterface>({ hour: 0, min: 0 });

	useEffect(() => {
		setTime({
			hour: props.value.getHours(),
			min: props.value.getMinutes(),
		});
	}, [props.value]);

	// props の value: Date を string に変換する。但し、フォーカスの有無で表示形式を変更する
	const value = useMemo(() => {
		if (isFocused) {
			const hourString = String(time.hour).padStart(2, '0');
			const minString = String(time.min).padStart(2, '0');
			if (time.hour === 0) {
				return `${minString}Min`;
			}
			return `${hourString}Hrs${minString}`;
		}
		return DateUtils.formatDateToTime(props.value);
	}, [props.value, isFocused, time]);

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

	const onBlur = async () => {
		const newVal = new Date(props.value.getTime());
		newVal.setHours(time.hour, time.min);
		if (props.onBlur) {
			await props.onBlur(newVal);
		}
		setIsFocused(false);
	};

	return (
		<TextInput
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			value={value}
			keyboardType="numeric"
			onFocus={onFocus}
			onKeyPress={onKeyPress}
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			onBlur={onBlur}
		/>
	);
};
