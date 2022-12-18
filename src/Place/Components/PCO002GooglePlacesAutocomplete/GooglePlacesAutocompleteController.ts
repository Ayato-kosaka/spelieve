import {
	PlaceAutocompleteRequest,
	PlaceAutocompleteResponse,
	PlaceAutocompleteResult,
	PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';
import { useState } from 'react';

import { UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interfaces';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { GooglePlacesAutocompletePropsInterface } from './GooglePlacesAutocompletePropsInterface';

import { Logger } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { PlaceHttpPost } from '@/Place/Endpoint/PlaceHttpPost';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const PCO002GooglePlacesAutocompleteController = ({
	onAutocompleteClicked,
	onlySpot,
	fetchDetails,
}: GooglePlacesAutocompletePropsInterface) => {
	const [searchInput, setSearchInput] = useState<string>('');
	const [placesResult, setPlacesResult] = useState<PlaceAutocompleteResult[]>([]);

	const onChangeInput = (input: string) => {
		setSearchInput(input);
		PlaceHttpPost<Omit<PlaceAutocompleteRequest['params'], 'key'>, PlaceAutocompleteResponse>('PBL004', {
			input,
			language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
			types: onlySpot ? ('geocode|establishment' as unknown as PlaceAutocompleteType) : undefined,
		})
			.then((res) => {
				setPlacesResult(res.data.predictions);
			})
			.catch((e) => {
				Logger('PCO002GooglePlacesAutocompleteController', 'onChangeInput.fetchPlaceAutocomplete.catch', e);
				setPlacesResult([]);
			});
	};

	const onPressAutocomplete = (place: PlaceAutocompleteResult) => {
		const fetchDetail = async () => {
			let detail: MPlace | null = null;
			if (fetchDetails) {
				detail = await PlaceHttpPost<UpsertPlaceDataBodyInterface, MPlace>('PBL002', {
					place_id: place.place_id,
					language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
				});
			}
			onAutocompleteClicked(place, detail);
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchDetail();
	};

	return { searchInput, placesResult, onChangeInput, onPressAutocomplete };
};
