import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { DecorationPropsInterface } from './DecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';

export const TMC02301Decoration = ({ decoration }: DecorationPropsInterface) => {
	// gesture 用の useSharedValue を定義
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);
	const scale = useSharedValue(1);
	const rotateZ = useSharedValue(0);

	// Context に変化が合った場合は、gesture 用の useSharedValue を更新する
	useEffect(() => {
		translateX.value = decoration.translateX;
	}, [decoration.translateX, translateX]);

	// animatedStyle を設定する
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

	const style = [{ width: 100, height: 100, backgroundColor: 'red' }, animatedStyle];

	return (
		<TCO001GestureProvider translateX={translateX} translateY={translateY} scale={scale} rotateZ={rotateZ}>
			<Animated.View style={style} />
		</TCO001GestureProvider>
	);
};
