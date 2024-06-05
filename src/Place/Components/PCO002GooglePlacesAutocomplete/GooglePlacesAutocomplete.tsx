import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { FlatListProps, Platform, TouchableOpacity, View } from 'react-native';
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
			renderResultList={({ data }: FlatListProps<PlaceAutocompleteResult>) => (
				<View>
					{data &&
						Array.from(data).map((item) => (
							<View key={item.place_id}>
								<TouchableOpacity onPress={() => onPressAutocomplete(item)}>
									<Text style={styles.renderItemText}>{item.description}</Text>
								</TouchableOpacity>
								<Divider />
							</View>
						))}
				</View>
			)}
			listContainerStyle={{ backgroundColor: '#fff', zIndex: 10, elevation: Platform.OS === 'android' ? 10 : 0 }}
			inputContainerStyle={[inputContainerStyle, { zIndex: 10, elevation: Platform.OS === 'android' ? 10 : 0 }]}
			renderTextInput={(props) => (
				<Searchbar value={searchInput} onChangeText={onChangeInput} placeholder={placeholder} />
			)}
		/>
	);
};
