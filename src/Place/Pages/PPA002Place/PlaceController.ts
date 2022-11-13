import { BottomTabParamList } from '@/App';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { PlaceControllerInterface, PlacePropsInterface } from 'spelieve-common/lib/Interfaces';

export const PPA002PlaceController = ({place_id, language}: PlacePropsInterface): PlaceControllerInterface => {
    const navigation = useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

    const onCreateItineraryClicked = (placeName: string) => {
        navigation.navigate('Place', {
            screen: 'IPA001ItineraryEdit',
            params: { place_id, placeName }
        });
    };

    const onShowMoreDetailClicked = () => {
        
    };

    const onShowMoreReviewClicked = () => {
        
    };

    const onImageClicked = () => {
        
    };

    const onShowMoreImageClicked = () => {
        
    };

    return {onCreateItineraryClicked, onShowMoreDetailClicked, onShowMoreReviewClicked, onImageClicked, onShowMoreImageClicked }
};
