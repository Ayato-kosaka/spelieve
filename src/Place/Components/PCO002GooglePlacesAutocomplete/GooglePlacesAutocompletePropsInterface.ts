import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { StyleProp, ViewStyle } from 'react-native';

import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

export interface GooglePlacesAutocompletePropsInterface {
	onAutocompleteClicked: (data: PlaceAutocompleteResult, detail: MPlace | null) => void;
	onlySpot: boolean;
	fetchDetails: boolean;
	placeholder?: string;
	inputContainerStyle?: StyleProp<ViewStyle>;
}
