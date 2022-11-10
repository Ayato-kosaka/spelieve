import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { GooglePlaceData, GooglePlaceDetail, AddressComponent } from 'react-native-google-places-autocomplete';

import { MPlacesListAddressInterface, PlacesControllerInterface } from 'spelieve-common/lib/Interfaces';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '@/App';

export const PPA001PlacesController = (): PlacesControllerInterface => {
	const { setAddress } = useContext(PCT011MPlacesList);
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

	const onPlaceSelected = (place_id: string) => {

		navigation.navigate('Place', {
			screen: 'PPA002Place',
			params: {
				place_id,
				language: 'ja',
			},
		});
	};

	const onAutoCompleteClicked = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
		const isIncludes = (arr: Array<string>, target: Array<string>) => arr.some((el) => target.includes(el));
		const pointType: Array<string> = ['establishment', 'street_address'];
		const sendedDataTypes: Array<string>= details?.types || [];

		if (isIncludes(sendedDataTypes, pointType)) {
			// 地点
			onPlaceSelected(data.place_id);
		} else {
			// 地名
			const addressParts: AddressComponent[] = details?.address_components || [];

			const searchedAddress: MPlacesListAddressInterface = {};

			searchedAddress.country =
				addressParts.find((addressPart) => addressPart.types.includes('country'))?.long_name;
			searchedAddress.administrativeAreaLevel1 =
				addressParts.find((addressPart) => addressPart.types.includes('administrative_area_level_1'))?.long_name;
			searchedAddress.administrativeAreaLevel2 =
				addressParts.find((addressPart) => addressPart.types.includes('administrative_area_level_2'))?.long_name;
			searchedAddress.locality =
				addressParts.find((addressPart) => addressPart.types.includes('locality'))?.long_name;
			setAddress(searchedAddress);
		}
	};

	return { onAutoCompleteClicked, onPlaceSelected };
};
