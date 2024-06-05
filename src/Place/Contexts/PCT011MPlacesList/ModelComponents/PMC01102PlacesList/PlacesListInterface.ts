import ReactNative from 'react-native';

export interface PlacesListPropsInterface {
	onPlaceSelected: (place_id: string) => void;
	style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
}
