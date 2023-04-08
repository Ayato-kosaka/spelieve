import { useAnimatedStyle } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

interface UseAnimatedStyleInterface extends Pick<GestureProviderPropsInterface, 'gesture' | 'canvasSize'> {
	componentSize?: { width: number; height: number };
}

export const TCO001UseAnimatedStyle = ({
	gesture,
	canvasSize,
	componentSize = {
		width: 0,
		height: 0,
	},
}: UseAnimatedStyleInterface) => {
	const { translateX, translateY, scale, rotateZ } = gesture;
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: translateX.value * canvasSize.width - componentSize.width / 2,
			},
			{
				translateY: translateY.value * canvasSize.height - componentSize.height / 2,
			},
			{ scale: scale.value },
			{ rotateZ: `${(rotateZ.value / Math.PI) * 180}deg` },
		],
	}));

	return {
		animatedStyle,
	};
};
