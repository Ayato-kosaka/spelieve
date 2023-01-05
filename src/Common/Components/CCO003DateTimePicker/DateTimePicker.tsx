import RNDateTimePicker, {
	IOSNativeProps,
	AndroidNativeProps,
	WindowsNativeProps,
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { Text } from 'react-native-paper';

export const CCO003DateTimePicker = ({ ...props }: IOSNativeProps & AndroidNativeProps & WindowsNativeProps) => {
	const [showPicker, setShowPicker] = useState<boolean>(Platform.OS !== 'android');

	const onButtonPress = useCallback(() => {
		setShowPicker(true);
	}, [setShowPicker]);

	const onChange = useCallback(
		(event: DateTimePickerEvent, date?: Date | undefined) => {
			props.onChange?.(event, date);
			if (Platform.OS === 'android') {
				setShowPicker(false);
			}
		},
		[props],
	);

	if (showPicker) {
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <RNDateTimePicker {...props} onChange={onChange} />;
	}
	return (
		<Text
			onPress={onButtonPress}
			style={{ textDecorationLine: 'underline', paddingHorizontal: 16, paddingVertical: 8 }}>
			{props.mode === 'time'
				? props.value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second:  })
				: props.value.toLocaleDateString(undefined, {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
				  })}
		</Text>
	);
};
