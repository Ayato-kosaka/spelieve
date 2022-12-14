import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { ListRenderItemInfo } from 'react-native';
import { AutocompleteInput } from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

import { PCO002GooglePlacesAutocompleteController } from './GooglePlacesAutocompleteController';
import { GooglePlacesAutocompletePropsInterface } from './GooglePlacesAutocompletePropsInterface';

import i18n from '@/Common/Hooks/i18n-js';

export const PCO002GooglePlacesAutocomplete = ({
	// TODO: 「'onAutoCompleteClicked' is missing in props validation」ESlintErrorが出る(onlySpot, fetchDetailsも)
	onAutoCompleteClicked,
	onlySpot,
	fetchDetails,
}: GooglePlacesAutocompletePropsInterface) => {
	const { searchInput, placesResult, onChangeInput, onPressAutocomplete } = PCO002GooglePlacesAutocompleteController({
		onAutoCompleteClicked,
		onlySpot,
		fetchDetails,
	});

	return (
		<AutocompleteInput
			data={placesResult}
			value={searchInput}
			onChangeText={onChangeInput}
			flatListProps={{
				renderItem: ({ item }: ListRenderItemInfo<PlaceAutocompleteResult>) => (
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
