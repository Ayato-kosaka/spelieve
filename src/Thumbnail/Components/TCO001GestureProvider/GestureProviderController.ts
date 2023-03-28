import { useAnimatedStyle } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TCO001UseAnimatedStyle = ({
	gesture,
	componentSize,
}: Pick<GestureProviderPropsInterface, 'gesture' | 'componentSize'>) => {
	const { translateX, translateY, scale, rotateZ } = gesture;
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: translateX.value * componentSize.width,
			},
			{
				translateY: translateY.value * componentSize.height,
			},
			{ scale: scale.value },
			{ rotateZ: `${(rotateZ.value / Math.PI) * 180}deg` },
		],
	}));

	return {
		animatedStyle,
	};
};
