import { useContext } from "react";
import { PlacesControllerInterface } from "spelieve-common/lib/Interfaces";
import { GooglePlaceData, GooglePlaceDetail, AddressComponent } from "react-native-google-places-autocomplete";
import { PCT011MPlacesList } from "@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList";
import { useNavigation } from "@react-navigation/native";

export const PPA001PlacesController = (): PlacesControllerInterface => {

    const { setSearchedAddress } = useContext(PCT011MPlacesList);
    const navigation = useNavigation();

    const onAutoCompleteClicked = (data: GooglePlaceData, details: GooglePlaceDetail) => {
        const isIncludes = (arr: Array<string>, target: Array<string>) => arr.some(el => target.includes(el));

        if (isIncludes(data.types, ['establishment' || 'street_address'])) { // 地点
            onPlaceSelected(data.place_id);

        } else { // 地名
            const addressParts: AddressComponent[] = details.address_components;

            let searchedAddress = {
                country: '',
                administrativeAreaLevel1: '',
                administrativeAreaLevel2: '',
                locality: '',
            }

            const toCamelCase = (str: string): string =>  // スネークケース->キャメルケース
                str.split('_').map((word, index) => {
                    if (index === 0) {
                        return word.toLowerCase();
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }).join('')


            addressParts.forEach((part) => {
                const val = part.long_name;
                const type = toCamelCase(part.types[0])
                searchedAddress = { ...searchedAddress, [type]: val }
            })
            setSearchedAddress(searchedAddress);
        }
    }

    const onPlaceSelected = (place_id: string) => {
        // PPA002 に遷移
        navigation.navigate('PPA002Place', {
            place_id: place_id,
            language: 'ja',
        });
    }

    return { onAutoCompleteClicked, onPlaceSelected };
}

