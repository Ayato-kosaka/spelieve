import RNDateTimePicker, {
	IOSNativeProps,
	AndroidNativeProps,
	WindowsNativeProps,
} from '@react-native-community/datetimepicker';

export const CCO003DateTimePicker = ({ ...props }: IOSNativeProps & AndroidNativeProps & WindowsNativeProps) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<RNDateTimePicker {...props} />
);
