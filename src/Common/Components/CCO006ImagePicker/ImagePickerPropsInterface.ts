import { ImagePickerOptions } from 'expo-image-picker';
import { FirebaseStorage } from 'firebase/storage';

export interface ImagePickerPropsInterface {
	children: React.ReactNode;
	onPickImage: (imageUrl: string) => void;
	imagePickerOptions: ImagePickerOptions;
	storage: FirebaseStorage;
}
