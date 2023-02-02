import { ActivityIndicator, ScrollView } from 'react-native';

import { IPA004ItineraryPreviewController } from './ItineraryPreviewController';

import { ItineraryTopTabScreenProps } from '@/Common/Navigation/NavigationInterface';
import { ICO001ItineraryPost } from '@/Itinerary/Components/ICO001ItineraryPost';

export const IPA004ItineraryPreview = ({ route, navigation }: ItineraryTopTabScreenProps<'ItineraryPreview'>) => {
	const { itinerary, planGroups, plans, needToShowActivityIndicator } = IPA004ItineraryPreviewController({
		route,
		navigation,
	});

	if (needToShowActivityIndicator) {
		return <ActivityIndicator animating />;
	}

	return (
		<ScrollView>
			<ICO001ItineraryPost itinerary={itinerary} planGroups={planGroups} plans={plans} />
		</ScrollView>
	);
};
