import { ImagePickerOptions } from 'expo-image-picker';

export interface ImagePickerPropsInterface {
	image: string;
	setImage: React.Dispatch<React.SetStateAction<string | null>>;
	imagePickerOptions: ImagePickerOptions;
}
