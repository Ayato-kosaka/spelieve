import { Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CCO006ImagePickerController } from './ImagePickerController';
import { ImagePickerPropsInterface } from './ImagePickerPropsInterface';
import { styles } from './ImagePickerStyle';

export const CCO006ImagePicker = ({
	children,
	onPickImage,
	imagePickerOptions,
	imageManipulatorActions,
	storage,
	style,
}: ImagePickerPropsInterface) => {
	const { pickImage } = CCO006ImagePickerController({
		onPickImage,
		imagePickerOptions,
		imageManipulatorActions,
		storage,
	});

	return (
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		<Pressable onPress={pickImage} style={style}>
			<MaterialCommunityIcons
				name="camera-outline"
				size={100}
				color="rgba(0,0,0,0.5)"
				style={styles.materialCommunityIcons}
			/>
			{children}
		</Pressable>
	);
};
