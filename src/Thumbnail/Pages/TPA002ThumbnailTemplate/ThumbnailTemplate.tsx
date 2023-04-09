import { useCallback, useContext } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';

import { MThumbnail } from 'spelieve-common/lib/Models/Thumbnail/TDB01/MThumbnail';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT012MThumbnailList } from '@/Thumbnail/Contexts/TCT012MThumbnailList/MThumbnailList';

export const TPA002ThumbnailTemplate = ({
	navigation,
	route,
}: ThumbnailStackScreenProps<'TPA002ThumbnailTemplate'>) => {
	// グローバルコンテキスト取得
	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	const { thumbnailList, isLoading } = useContext(TCT012MThumbnailList);

	const onThumbnailSelected = useCallback(
		(thumbnailID: string, thumbnail: MThumbnail) => {
			setThumbnailItemMapper((val) => ({
				...val,
				storeUrlMap: { ...thumbnail.dummyStoreUrlMap, ...val.storeUrlMap },
				textMap: { ...thumbnail.dummyTextMap, ...val.textMap },
			}));
			navigation.navigate({
				name: 'TPA001ThumbnailEditor',
				params: {
					fromThumbnailID: thumbnailID,
				},
				merge: true,
			});
		},
		[navigation, setThumbnailItemMapper],
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
						onPress={() => onThumbnailSelected(thumbnailDoc.id, thumbnail)}
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
