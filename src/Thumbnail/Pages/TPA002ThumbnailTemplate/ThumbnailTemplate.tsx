import { useCallback, useContext } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';

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
		<View
			style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
			}}>
			{thumbnailList.map((thumbnailDoc, index) => {
				const thumbnail = thumbnailDoc.data();
				return (
					<Pressable
						key={thumbnailDoc.id}
						onPress={() => onThumbnailSelected(thumbnailDoc.id)}
						style={{
							width: '50%',
							padding: 8,
						}}>
						<Image
							source={{ uri: thumbnail.imageUrl }}
							style={{
								width: '100%',
								paddingTop: '100%',
							}}
						/>
					</Pressable>
				);
			})}
		</View>
	);
};
