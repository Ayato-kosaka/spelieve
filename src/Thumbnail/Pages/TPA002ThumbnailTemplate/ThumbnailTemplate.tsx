import { useCallback, useContext } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT012MThumbnailList } from '@/Thumbnail/Contexts/TCT012MThumbnailList/MThumbnailList';

export const TPA002ThumbnailTemplate = ({
	navigation,
	route,
}: ThumbnailStackScreenProps<'TPA002ThumbnailTemplate'>) => {
	const { thumbnailList, isLoading } = useContext(TCT012MThumbnailList);

	const onThumbnailSelected = useCallback(
		(thumbnailID: string) => {
			navigation.navigate({
				name: 'TPA001ThumbnailEditor',
				params: {
					fromThumbnailID: thumbnailID,
				},
				merge: true,
			});
		},
		[navigation],
	);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}

	return (
		<View>
			{thumbnailList.map((thumbnailDoc) => (
				<Pressable key={thumbnailDoc.id} onPress={() => onThumbnailSelected(thumbnailDoc.id)}>
					<Text>{thumbnailDoc.data().backgroundItemType}</Text>
				</Pressable>
			))}
		</View>
	);
};
