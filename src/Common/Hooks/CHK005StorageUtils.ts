import { FirebaseStorage, getDownloadURL, ref, StorageReference, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';

export const CHK005StorageUtils = {
	uploadImageAsync: async (storage: FirebaseStorage, uri: string): Promise<string> => {
		// Why are we using XMLHttpRequest? See:
		// https://github.com/expo/expo/issues/2402#issuecomment-443726662
		const blob: Blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = () => {
				resolve(xhr.response as Blob);
			};
			xhr.onerror = (e) => {
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			xhr.send(null);
		});
		const storageRef: StorageReference = ref(storage, uuid.v4() as string);
		await uploadBytes(storageRef, blob);

		// Expo の公式ソースでは、以下が記載されていたが、`blob.close is not a function`とエラーが出るためコメントアウト
		// blob.close()

		return getDownloadURL(storageRef);
	},
};
