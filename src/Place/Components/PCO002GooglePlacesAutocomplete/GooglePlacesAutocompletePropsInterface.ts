import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';

import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

export interface GooglePlacesAutocompletePropsInterface {
	onAutocompleteClicked: (data: PlaceAutocompleteResult, detail: MPlace | null) => void;
	onlySpot: boolean;
	fetchDetails: boolean;
}
