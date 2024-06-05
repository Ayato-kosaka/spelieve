import { IOSNativeProps, AndroidNativeProps, WindowsNativeProps } from '@react-native-community/datetimepicker';
import { useCallback, useMemo } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextInput } from 'react-native-paper';

export const CCO003DateTimePicker = ({
	value,
	mode = 'date',
	onChange,
	minuteInterval,
	style,
}: IOSNativeProps & AndroidNativeProps & WindowsNativeProps) => {
	const onChangeDatePicker: ReactDatePickerProps['onChange'] = useCallback(
		(date) => {
			if (onChange && date instanceof Date) {
				// #961 TimeFiled を直接入力すると ReactDatePickerProps#onChange の date が本日日付で発火することが判明したため、
				// props.onChange に渡す Date の変更項目を mode で分岐することで詳細化する。
				const newDate = new Date(value.getTime());
				if (mode === 'time') {
					newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
				} else if (mode === 'date') {
					newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
				}
				onChange(
					{
						type: 'set',
						nativeEvent: {
							timestamp: 0,
							utcOffset: 0,
						},
					},
					newDate,
				);
			}
		},
		[value, mode, onChange],
	);

	const showTimeSelect = useMemo(() => mode === 'time', [mode]);

	const showTimeSelectOnly = useMemo(() => showTimeSelect, [showTimeSelect]);

	const timeIntervals = useMemo(() => minuteInterval, [minuteInterval]);

	const dateFormat = useMemo(() => {
		if (mode === 'time') {
			return 'hh:mm aa';
		}
		return 'MMMM d, yyyy';
	}, [mode]);

	return (
		<DatePicker
			customInput={<TextInput style={style} />}
			selected={value}
			onChange={onChangeDatePicker}
			showTimeSelect={showTimeSelect}
			showTimeSelectOnly={showTimeSelectOnly}
			timeIntervals={timeIntervals}
			dateFormat={dateFormat}
		/>
	);
};
