import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { AutocompleteInput } from 'react-native-autocomplete-input';
import { Divider, Searchbar, Text } from 'react-native-paper';

import { PCO002GooglePlacesAutocompleteController } from './GooglePlacesAutocompleteController';
import { GooglePlacesAutocompletePropsInterface } from './GooglePlacesAutocompletePropsInterface';
import { styles } from './GooglePlacesAutocompleteStyle';

import i18n from '@/Common/Hooks/i18n-js';

export const PCO002GooglePlacesAutocomplete = ({
	onAutocompleteClicked,
	onlySpot,
	fetchDetails,
	placeholder = i18n.t('Search Place'),
	inputContainerStyle,
}: GooglePlacesAutocompletePropsInterface) => {
	const { searchInput, placesResult, onChangeInput, onPressAutocomplete } = PCO002GooglePlacesAutocompleteController({
		onAutocompleteClicked,
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
					<>
						<TouchableOpacity onPress={() => onPressAutocomplete(item)}>
							<Text style={styles.renderItemText}>{item.description}</Text>
						</TouchableOpacity>
						<Divider />
					</>
				),
			}}
			listContainerStyle={{ backgroundColor: '#fff' }}
			inputContainerStyle={inputContainerStyle}
			renderTextInput={(props) => (
				<Searchbar value={searchInput} onChangeText={onChangeInput} placeholder={placeholder} />
			)}
		/>
	);
};
