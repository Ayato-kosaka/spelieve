import { useCallback } from 'react';
import { useAnimatedStyle } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

interface UseAnimatedStyleInterface extends Pick<GestureProviderPropsInterface, 'gesture' | 'canvasSize'> {
	componentSize?: { width: number; height: number } | undefined;
}

export const TCO001CalcAnimatedGesture = ({
	canvasSize,
	componentSize,
}: Required<Pick<UseAnimatedStyleInterface, 'canvasSize' | 'componentSize'>>) => {
	const getTranslateX = useCallback(
		(translateX: number) => translateX * canvasSize.width - componentSize.width / 2,
		[canvasSize.width, componentSize?.width],
	);
	const getTranslateY = useCallback(
		(translateY: number) => translateY * canvasSize.height - componentSize.height / 2,
		[canvasSize.height, componentSize?.height],
	);
	const getScale = useCallback((scale: number) => scale, []);
	const getRotateZ = useCallback((rotateZ: number) => `${(rotateZ / Math.PI) * 180}deg`, []);
	return {
		getTranslateX,
		getTranslateY,
		getScale,
		getRotateZ,
	};
};

export const TCO001UseAnimatedStyle = ({
	gesture,
	canvasSize,
	componentSize = {
		width: 0,
		height: 0,
	},
}: UseAnimatedStyleInterface) => {
	const { getTranslateX, getTranslateY, getScale, getRotateZ } = TCO001CalcAnimatedGesture({
		canvasSize,
		componentSize,
	});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: getTranslateX(gesture.translateX.value),
			},
			{
				translateY: getTranslateY(gesture.translateY.value),
			},
			{ scale: getScale(gesture.scale.value) },
			{ rotateZ: getRotateZ(gesture.rotateZ.value) },
		],
	}));

	return {
		animatedStyle,
	};
};
