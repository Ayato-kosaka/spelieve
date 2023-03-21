import { useAnimatedStyle } from 'react-native-reanimated';

import { GestureProviderInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TCO001UseAnimatedStyle = ({ translateX, translateY, scale, rotateZ }: GestureProviderInterface) => {
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: translateX.value,
			},
			{
				translateY: translateY.value,
			},
			{ scale: scale.value },
			{ rotateZ: `${(rotateZ.value / Math.PI) * 180}deg` },
		],
	}));

	return {
		animatedStyle,
	};
};
