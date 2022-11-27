import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { GooglePlaceData, GooglePlaceDetail, AddressComponent } from 'react-native-google-places-autocomplete';

import {
	MPlacesListAddressInterface,
	PlacesControllerInterface,
	PlacesPropsInterface,
} from 'spelieve-common/lib/Interfaces';

import { BottomTabParamList } from '@/App';
import { PCT011MPlacesList } from '@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList';

export const PPA001PlacesController = ({
	country,
	administrativeAreaLevel1,
	administrativeAreaLevel2,
	locality,
}: PlacesPropsInterface): PlacesControllerInterface => {
	const { placesList, setAddress } = useContext(PCT011MPlacesList);
	const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const PCT011MPlacesListVal = useContext(PCT011MPlacesList);

	useEffect(() => {
		if (placesList.length === 0 && PCT011MPlacesListVal.isLoading) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [placesList, PCT011MPlacesListVal.isLoading]);

	useEffect(() => {
		if (country) {
			setAddress({ country, administrativeAreaLevel1, administrativeAreaLevel2, locality });
		} else {
			// TODO: https://github.com/Ayato-kosaka/spelieve/issues/305 現在地からGepoint取得
			navigation.navigate('Place', {
				screen: 'PPA001Places',
				params: {
					country: '日本',
					administrativeAreaLevel1: '神奈川県',
					administrativeAreaLevel2: '',
					locality: '横浜市',
				},
			});
		}
	}, [country, administrativeAreaLevel1, administrativeAreaLevel2, locality, navigation, setAddress]);

	const onPlaceSelected = (place_id: string) => {
		navigation.navigate('Place', {
			screen: 'PPA002Place',
			params: {
				place_id,
			},
		});
	};

	const onAutoCompleteClicked = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
		const isIncludes = (arr: Array<string>, target: Array<string>) => arr.some((el) => target.includes(el));
		const pointType: Array<string> = ['establishment', 'street_address'];
		const sendedDataTypes: Array<string> = details?.types || [];

		if (isIncludes(sendedDataTypes, pointType)) {
			// 地点
			onPlaceSelected(data.place_id);
		} else {
			// 地名
			const addressParts: AddressComponent[] = details?.address_components || [];

			const searchedAddress: MPlacesListAddressInterface = {};

			searchedAddress.country = addressParts.find((addressPart) => addressPart.types.includes('country'))?.long_name;
			searchedAddress.administrativeAreaLevel1 = addressParts.find((addressPart) =>
				addressPart.types.includes('administrative_area_level_1'),
			)?.long_name;
			searchedAddress.administrativeAreaLevel2 = addressParts.find((addressPart) =>
				addressPart.types.includes('administrative_area_level_2'),
			)?.long_name;
			searchedAddress.locality = addressParts.find((addressPart) => addressPart.types.includes('locality'))?.long_name;
			navigation.navigate('Place', {
				screen: 'PPA001Places',
				params: searchedAddress,
			});
		}
	};

	return { onAutoCompleteClicked, onPlaceSelected, isLoading };
};
