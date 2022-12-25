import { Pressable } from 'react-native';

import { CCO006ImagePickerController } from './ImagePickerController';
import { ImagePickerPropsInterface } from './ImagePickerPropsInterface';

export const CCO006ImagePicker = ({
	children,
	onPickImage,
	imagePickerOptions,
	imageManipulatorActions,
	storage,
	style,
}: ImagePickerPropsInterface) => {
	const { pickImage } = CCO006ImagePickerController({
		children,
		onPickImage,
		imagePickerOptions,
		imageManipulatorActions,
		storage,
		style,
	});

	return (
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		<Pressable onPress={pickImage} style={style}>
			{children}
		</Pressable>
	);
};
