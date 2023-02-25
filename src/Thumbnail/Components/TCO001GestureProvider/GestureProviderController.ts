import { useCallback } from 'react';
import { AnimatedTransform, SharedValue, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';

import {
	GestureProviderInterface,
	GestureProviderPropsInterface,
} from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TCO001UseAnimatedStyle = () => {
	const animatedStyleShared: SharedValue<{ transform: AnimatedTransform }> = useDerivedValue(() => ({ transform: [] }));
	const onAnimating: GestureProviderPropsInterface['onAnimating'] = useCallback(
		(event: GestureProviderInterface) => {
			'worklet';

			if (!animatedStyleShared.value) return;
			animatedStyleShared.value = {
				transform: [
					{
						translateX: event.translateX,
					},
					{
						translateY: event.translateY,
					},
					{ scale: event.scale },
					{ rotateZ: `${(event.rotateZ / Math.PI) * 180}deg` },
				],
			};
		},
		[animatedStyleShared],
	);

	const animatedStyle = useAnimatedStyle(() => animatedStyleShared?.value || {});

	return {
		onAnimating,
		animatedStyle,
	};
};
