import { useContext } from 'react';
import { GooglePlaceData, GooglePlaceDetail, AddressComponent } from 'react-native-google-places-autocomplete';

import { PlacesControllerInterface } from 'spelieve-common/lib/Interfaces';

import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export const PPA001PlacesController = (): PlacesControllerInterface => {
	const { setSearchedAddress, onPlaceSelected } = useContext(PCT011MPlacesList);

	const onAutoCompleteClicked = (data: GooglePlaceData, details: GooglePlaceDetail) => {
		const isIncludes = (arr: Array<string>, target: Array<string>) => arr.some((el) => target.includes(el));
		const pointType: Array<string> = ['establishment', 'street_address'];
		const sendedDataTypes: Array<string> = data.types;

		if (isIncludes(sendedDataTypes, pointType)) {
			// 地点
			onPlaceSelected(data.place_id);
		} else {
			// 地名
			const addressParts: AddressComponent[] = details.address_components;

			const searchedAddress = {
				country: '',
				administrativeAreaLevel1: '',
				administrativeAreaLevel2: '',
				locality: '',
			};

			searchedAddress.country =
				addressParts.find((addressPart) => addressPart.types.includes('country'))?.long_name || '';
			searchedAddress.administrativeAreaLevel1 =
				addressParts.find((addressPart) => addressPart.types.includes('administrative_area_level_1'))?.long_name || '';
			searchedAddress.administrativeAreaLevel2 =
				addressParts.find((addressPart) => addressPart.types.includes('administrative_area_level_2'))?.long_name || '';
			searchedAddress.locality =
				addressParts.find((addressPart) => addressPart.types.includes('locality'))?.long_name || '';
			setSearchedAddress(searchedAddress);
		}
	};

	return { onAutoCompleteClicked };
};
