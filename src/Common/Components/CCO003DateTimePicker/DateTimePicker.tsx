import RNDateTimePicker, {
	IOSNativeProps,
	AndroidNativeProps,
	WindowsNativeProps,
} from '@react-native-community/datetimepicker';
import { useCallback, useState } from 'react';
import { Button } from 'react-native-paper';

import i18n from '@/Common/Hooks/i18n-js';

export const CCO003DateTimePicker = ({ ...props }: IOSNativeProps & AndroidNativeProps & WindowsNativeProps) => {
	const [showPicker, setShowPicker] = useState<boolean>(false); // Platform.OS !== 'android'

	const onButtonPress = useCallback(() => {
		setShowPicker(true);
	}, [setShowPicker]);

	if (showPicker) {
		// eslint-disable-next-line react/jsx-props-no-spreading
		return <RNDateTimePicker {...props} />;
	}
	return (
		<Button onPress={onButtonPress}>{props.mode === 'time' ? i18n.t('select time') : i18n.t('select date')}</Button>
	);
};
