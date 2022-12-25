import { ImagePickerOptions } from 'expo-image-picker';
import { FirebaseStorage } from 'firebase/storage';
import { StyleProp, ViewStyle } from 'react-native';

export interface ImagePickerPropsInterface {
	children: React.ReactNode;
	onPickImage: (imageUrl: string) => void;
	imagePickerOptions: ImagePickerOptions;
	storage: FirebaseStorage;
	style?: StyleProp<ViewStyle>;
}
