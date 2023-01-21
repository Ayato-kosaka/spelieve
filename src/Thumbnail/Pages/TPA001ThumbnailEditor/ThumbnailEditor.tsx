import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-paper';

import { TMC01101ThumbnailBackground } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ModelComponents/TMC01101ThumbnailBackground/ThumbnailBackground';
import { TCT023DecorationsMapProvider } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';

const MThumbnail = {
	baseItemType: 'Shape',
};

export const TPA001ThumbnailEditor = () =>
	// { navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>
	{
		const a = 1;

		return (
			<TCT023DecorationsMapProvider>
				<SafeAreaView />
				<View style={{ height: '100%', justifyContent: 'flex-end' }}>
					<TMC01101ThumbnailBackground aspectRatio={4 / 3} />
					<View style={{ width: '100%' }}>
						<View>
							<Text>Replace</Text>
						</View>
					</View>
				</View>
			</TCT023DecorationsMapProvider>
		);
	};
