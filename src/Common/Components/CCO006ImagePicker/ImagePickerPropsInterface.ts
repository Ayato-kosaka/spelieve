import { ImagePickerOptions } from 'expo-image-picker';
import { FirebaseStorage } from 'firebase/storage';

export interface ImagePickerPropsInterface {
	image: string;
	setImage: React.Dispatch<React.SetStateAction<string | null>>;
	imagePickerOptions: ImagePickerOptions;
	storage: FirebaseStorage;
}
