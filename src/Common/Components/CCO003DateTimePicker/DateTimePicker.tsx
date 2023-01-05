import RNDateTimePicker, {
	IOSNativeProps,
	AndroidNativeProps,
	WindowsNativeProps,
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { Button } from 'react-native-paper';

import i18n from '@/Common/Hooks/i18n-js';

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
		<Button onPress={onButtonPress}>{props.mode === 'time' ? i18n.t('select time') : i18n.t('select date')}</Button>
	);
};
