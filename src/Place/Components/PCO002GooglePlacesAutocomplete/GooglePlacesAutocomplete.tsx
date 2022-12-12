import {
	PlaceAutocompleteRequest,
	PlaceAutocompleteResponse,
	PlaceAutocompleteResult,
	PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';
import { useState } from 'react';
import { AutocompleteInput } from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

import { UpsertPlaceDataBodyInterface } from 'spelieve-common/lib/Interfaces';
import { MPlace } from 'spelieve-common/lib/Models/Place/PDB01/MPlace';

import { GooglePlacesAutocompletePropsInterface } from './GooglePlacesAutocompletePropsInterface';

import i18n from '@/Common/Hooks/i18n-js';
import { PlaceHttpPost } from '@/Place/Endpoint/PlaceHttpPost';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';



export const PCO002GooglePlacesAutocomplete = ({
	onAutoCompleteClicked,
	onlySpot,
	fetchDetails,
}: GooglePlacesAutocompletePropsInterface) => {
	const [searchInput, setSearchInput] = useState<string>('');
	const [placesResult, setplacesResult] = useState<PlaceAutocompleteResult[]>([]); // TODO: PlaceDetailsの型？で管理 (name, place_idが必要)

	// TODO: 完成後Controllerへ移動

	const onChangeInput = (input: string) => {
		// backend place autocompleteにアクセス
		console.log('input: ', input);
		setSearchInput(input);
		const fetchPlaceAutocomplete = async () => {
			const placesResult = await PlaceHttpPost<
				Omit<PlaceAutocompleteRequest['params'], 'key'>,
				PlaceAutocompleteResponse
			>('PBL004', {
				input,
				language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
				types: onlySpot ? ('geocode|establishment' as unknown as PlaceAutocompleteType) : undefined,
			})
				.then((res) => {
					setplacesResult(res.data.predictions);
				})
				.catch((e) => console.log(e));
			console.log(placesResult);
		};
		// fetchSetTags(input); // acccess backend
		fetchPlaceAutocomplete();
	};

	const onPressAutocomplete = async (place: PlaceAutocompleteResult) => {
		console.log('clickされました.');
		let detail = null;
		if (fetchDetails) {
			detail = await PlaceHttpPost<UpsertPlaceDataBodyInterface, MPlace>('PBL002', {
				place_id: place.place_id,
				language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
			});
		}
		onAutoCompleteClicked(place, detail);
	};

	return (
		<AutocompleteInput
			data={placesResult}
			value={searchInput}
			onChangeText={onChangeInput}
			flatListProps={{
				data: placesResult,
				renderItem: ({ item }: { item: PlaceAutocompleteResult }) => (
					// TODO: detailは最初から取得するor dataのみ取得->押されたらplaceIDで再度detials取得
					// <TouchableOpacity onPress={() => onPressAutocomplete(itemData.item.)}>
					<TouchableOpacity onPress={() => onPressAutocomplete(item)}>
						<Text style={{ color: 'black' }}>{item.description}</Text>
					</TouchableOpacity>
				),
			}}
			placeholder={i18n.t('searchPlaceText')}
			listContainerStyle={{ backgroundColor: '#fff' }}
		/>
	);
};
