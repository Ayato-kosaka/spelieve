import { useEffect, useContext } from "react";
import { PCT011MPlacesList } from "@/Place/Models/PDB01MPlace/Contexts/PCT011MPlacesList";
import { PlacesControllerInterface } from "spelieve-common/lib/Interfaces";
import { GooglePlaceData, GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { AddressComponent } from "react-native-google-places-autocomplete";

export const PPA001PlacesController = (): PlacesControllerInterface => {

    const { 
        setCountry, 
        setAdministrativeAreaLevel1, 
        setAdministrativeAreaLevel2, 
        setLocality 
    } = useContext(PCT011MPlacesList);
    
    const onAutoCompleteClicked = (data: GooglePlaceData, details: GooglePlaceDetail) => {
        const isIncludes = (arr: Array<string>, target: Array<string>) => arr.some(el => target.includes(el));
        const initState = () => {
            setCountry("");
            setAdministrativeAreaLevel1("");
            setAdministrativeAreaLevel2("");
            setLocality("");
        }
       
        if (isIncludes(data.types, ['establishment' || 'street_address'])) { // 地点
            onPlaceSelected();
        } else { // 地名
            // console.log("data: ", data);
            console.log("details: ", details);
            console.log("\n");
            const addressParts: AddressComponent[] = details.address_components;
            initState(); // TODO: 今のままだと、setした分だけ、PCTがレンダリングされて無駄
            addressParts.forEach((part) => {
                const val = part.long_name;
                switch(part.types[0]) {
                    case "country":
                        setCountry(val);
                        break;
                    case "administrative_area_level_1":
                        setAdministrativeAreaLevel1(val);
                        break;
                    case "administrative_area_level_2":
                        setAdministrativeAreaLevel2(val);
                        break;
                    case "locality":
                        setLocality(val);
                        break;
                    case "sublocality":
                        // setSublocality(val);
                        // break;
                    default:
                        break;
                }
            })
            
        }
    }
    
    const onPlaceSelected = () => {
        //PPA002 に遷移
        console.log('onPlaceSelected動きました')
    }

    return { onAutoCompleteClicked, onPlaceSelected };
}


