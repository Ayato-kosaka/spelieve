import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';

export const CCO006ImagePicker = () => {
	const [image, setImage] = useState<string | null>(null);

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: false,
			allowsMultipleSelection: false,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		// TODO: Button のみにする
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
