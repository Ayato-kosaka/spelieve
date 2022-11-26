import { IOSNativeProps, AndroidNativeProps, WindowsNativeProps } from '@react-native-community/datetimepicker';
import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const CCO003DateTimePicker = ({ ...props }: IOSNativeProps & AndroidNativeProps & WindowsNativeProps) => {
	const onChange = (date: Date) => {
		if (props.onChange) {
			props.onChange(
				{
					type: 'set',
					nativeEvent: {},
				},
				date,
			);
		}
	};

	const showTimeSelect = useMemo(() => props.mode === 'time', [props.mode]);

	const showTimeSelectOnly = useMemo(() => showTimeSelect, [showTimeSelect]);

	const timeIntervals = useMemo(() => props.minuteInterval, [props.minuteInterval]);

	const dateFormat = useMemo(() => {
		if (props.mode === 'time') {
			return 'hh:mm aa';
		}
		return 'MMMM d, yyyy';
	}, [props.mode]);

	return (
		<DatePicker
			selected={props.value}
			onChange={onChange}
			showTimeSelect={showTimeSelect}
			showTimeSelectOnly={showTimeSelectOnly}
			timeIntervals={timeIntervals}
			dateFormat={dateFormat}
		/>
	);
};
