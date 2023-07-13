import { ComponentProps } from 'react';
import { TextInput } from 'react-native-paper';

import { CCO004DurationPickerController } from './DurationPickerController';
import { DurationPickerPropsInterface } from './DurationPickerInterface';

export const CCO004DurationPicker = ({
	...props
}: Omit<ComponentProps<typeof TextInput>, 'value' | 'onBlur' | 'keyboardType'> & DurationPickerPropsInterface) => {
	const { textInputValue, onFocus, onKeyPress, textInputOnBlur } = CCO004DurationPickerController({
		value: props.value,
		onBlur: props.onBlur,
	});

	return (
		<TextInput
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			value={textInputValue}
			keyboardType="numeric"
			onFocus={onFocus}
			onKeyPress={onKeyPress}
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			onBlur={textInputOnBlur}
		/>
	);
};
