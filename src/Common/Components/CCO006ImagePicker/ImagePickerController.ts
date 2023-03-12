import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Alert } from 'react-native';

import { ImagePickerPropsInterface } from './ImagePickerPropsInterface';

import { CHK005StorageUtils } from '@/Common/Hooks/CHK005StorageUtils';
import i18n from '@/Common/Hooks/i18n-js';

export const CCO006ImagePickerController = ({
	onPickImage,
	imagePickerOptions,
	imageManipulatorActions,
	storage,
}: Omit<ImagePickerPropsInterface, 'children' | 'style'>) => {
	const resizeImage = async (uri: string): Promise<string> => {
		const result = await manipulateAsync(uri, imageManipulatorActions, { compress: 1, format: SaveFormat.PNG });
		return result.uri;
	};
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		const pickerResult = await launchImageLibraryAsync(imagePickerOptions);

		// iOS でエラーが出るためコメントアウト
		// Logger('CCO006ImagePicker', 'pickImage.pickerResult', pickerResult);

		try {
			if (!pickerResult.canceled) {
				const resizedUri: string = await resizeImage(pickerResult.assets[0].uri);
				const uploadUrl: string = await CHK005StorageUtils.uploadImageAsync(storage, resizedUri);
				onPickImage(uploadUrl);
			}
		} catch (e) {
			Alert.alert(i18n.t('Upload failed, sorry :('));
		}
	};

	return { pickImage };
};
