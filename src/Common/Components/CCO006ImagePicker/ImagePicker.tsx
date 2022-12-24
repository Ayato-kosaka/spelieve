import * as ImageManipulator from 'expo-image-manipulator';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { Alert, Button, Image, View } from 'react-native';
import uuid from 'react-native-uuid';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import { storage } from '@/Itinerary/Endpoint/firebaseStorage';

export const CCO006ImagePicker = () => {
	const [image, setImage] = useState<string | null>(null);

	const resizeImage = async (uri: string): Promise<string> => {
		const result = await ImageManipulator.manipulateAsync(
			uri,
			[
				{
					resize: {
						width: 2000,
					},
				},
			],
			{ compress: 0, format: ImageManipulator.SaveFormat.PNG },
		);

		return result.uri;
	};

	const uploadImageAsync = async (uri: string): Promise<string> => {
		// Why are we using XMLHttpRequest? See:
		// https://github.com/expo/expo/issues/2402#issuecomment-443726662
		const blob: Blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = () => {
				resolve(xhr.response as Blob);
			};
			xhr.onerror = (e) => {
				console.log(e);
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			xhr.send(null);
		});
		const fileRef = ref(storage, uuid.v4() as string);
		await uploadBytes(fileRef, blob);

		// Expo の公式ソースでは、以下が記載されていたが、`blob.close is not a function`とエラーが出るためコメントアウト
		// blob.close()

		return getDownloadURL(fileRef);
	};

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		const pickerResult = await launchImageLibraryAsync({
			allowsEditing: false,
			allowsMultipleSelection: false,
			mediaTypes: MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1,
		});

		// iOS でエラーが出るためコメントアウト
		// Logger('CCO006ImagePicker', 'pickImage.pickerResult', pickerResult);

		try {
			if (!pickerResult.canceled) {
				const resizedUri = await resizeImage(pickerResult.assets[0].uri);
				const uploadUrl = await uploadImageAsync(resizedUri);
				setImage(uploadUrl);
			}
		} catch (e) {
			Logger('CCO006ImagePicker', 'pickImage.uploadImage.catch', e);
			Alert.alert('Upload failed, sorry :(');
		}
	};

	return (
		// TODO: onPress のみにする
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button
				title="Pick an image from camera roll"
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onPress={pickImage}
			/>
			{image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
		</View>
	);
};
