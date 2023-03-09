import { Action } from 'expo-image-manipulator';
import { ImagePickerOptions } from 'expo-image-picker';
import { FirebaseStorage } from 'firebase/storage';
import { StyleProp, ViewStyle } from 'react-native';

export interface ImagePickerPropsInterface {
	children: React.ReactNode;
	onPickImage: (imageUrl: string, key?: string) => void;
	imagePickerOptions: ImagePickerOptions;
	imageManipulatorActions: Action[];
	storage: FirebaseStorage;
	style?: StyleProp<ViewStyle>;
}
