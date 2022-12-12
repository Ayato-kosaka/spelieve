import { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { SearchPlacePropsInterface } from 'spelieve-common/lib/Interfaces';

import i18n from '@/Common/Hooks/i18n-js';
import { ENV } from '@/ENV';
import { AutocompleteInput } from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { PlaceHttpPost } from '@/Place/Endpoint/PlaceHttpPost';
import { PlaceAutocompleteRequest, PlaceAutocompleteResponse, } from '@googlemaps/google-maps-services-js';
import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';
// import { GooglePlaceLanguageTagFromIETFLanguageTag } from '@/Place/Hooks/PHK001GooglePlaceAPI';

export const PCO002GooglePlacesAutocomplete = (
	// onAutoCompleteClicked,
	// hideCities,
	// fetchDetails,
	// value,
	// onChange,
// }: SearchPlacePropsInterface) => {
) => {
	const [searchInput, setSearchInput] = useState<string>('');
	const [placesResult, setplacesResult] = useState<[]>([]); // TODO: PlaceDetailsの型？で管理 (name, place_idが必要)

	// TODO: 完成後Controllerへ移動

	const onChangeInput = (input: string) => {
		// backend place autocompleteにアクセス
		console.log("input: ", input);
		setSearchInput(input);
		const fetchPlaceAutocomplete = async () => {
			const placesResult = await PlaceHttpPost<PlaceAutocompleteRequest, PlaceAutocompleteResponse>('PBL004', { input, language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale], })
				.then(res => {
					console.log(res.data);
					return res.data.predictions.map(placeData => {
						const { description, place_id } = placeData;
						return { description, place_id }
					})
				})
				.catch(e => console.log(e));
			setplacesResult(placesResult);
			console.log(placesResult);
		}
		// fetchSetTags(input); // acccess backend
		fetchPlaceAutocomplete()
	};

	const onPressAutocomplete = () => {
		console.log("clickされました.")
		// onAutoCompleteClicked() // 場所なら動かす
	}

	return (
		<AutocompleteInput
			data={placesResult}
			value={searchInput}
			onChangeText={onChangeInput}
			flatListProps={{
				renderItem: ({item}) => (
					// TODO: detailは最初から取得するor dataのみ取得->押されたらplaceIDで再度detials取得
					// <TouchableOpacity onPress={() => onPressAutocomplete(itemData.item.)}>
					<TouchableOpacity onPress={() => console.log(item)}>
						<Text style={{ color: 'black' }}>{item.description}</Text>
					</TouchableOpacity>
				)
			}}
			placeholder={i18n.t('searchPlaceText')}
			listContainerStyle={{ backgroundColor: '#fff' }}
		// query={{
		// 	key: ENV.GCP_API_KEY,
		// 	type: hideCities ? 'establishment' : ['(cities)', 'establishment'],
		// 	language: GooglePlaceLanguageTagFromIETFLanguageTag[i18n.locale],
		// }}
		// requestUrl={{
		// 	useOnPlatform: 'web',
		// 	url: `${ENV.PROXY_SERVER_URL}https://maps.googleapis.com/maps/api`,
		// 	headers: {
		// 		'Access-Control-Allow-Origin': '*',
		// 	},
		// }}
		// fetchDetails={fetchDetails}
		// textInputProps={{
		// 	value,
		// 	onChange,
		// }}
		/>
	)
};
