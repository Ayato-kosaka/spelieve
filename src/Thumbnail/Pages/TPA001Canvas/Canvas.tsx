import React from 'react';
import { SafeAreaView } from 'react-native';

import { TMC01101Decoration } from '@/Thumbnail/Contexts/TCT023XXX/ModelComponents/TMC02301Decoration/Decoration';

const MThumbnail = {
	baseItemType: 'Shape',
};
const decorations = {
	XXX: {
		translateX: 200,
		translateY: 0,
		rotateZ: 0,
		scale: 0,
	},
};

export const TPA001Canvas = () =>
	// { navigation, route }: NativeStackScreenProps<BottomTabParamList, 'PPA001Places'>
	{
		const a = 1;

		return (
			<>
				<SafeAreaView />
				<TMC01101Decoration translateX={decorations.XXX.translateX} />
			</>
		);
	};
