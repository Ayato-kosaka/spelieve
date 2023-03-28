import React, { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from './GestureProviderPropsInterface';

import { Logger } from '@/Common/Hooks/CHK001Utils';

export const TCO001GestureProvider = ({
	gesture,
	isActive = true,
	onEndGesture,
	onSingleTapFinalize,
	children,
	componentSize,
}: GestureProviderPropsInterface) => {
	/**
	 * translateX -> style に反映される translateX
	 * savedTranslateX ->  手を止めた状態の translateX
	 */
	const { translateX, translateY, scale, rotateZ } = gesture;
	const savedTranslateX = useSharedValue(translateX.value);
	const savedTranslateY = useSharedValue(translateY.value);
	const savedScale = useSharedValue(scale.value);
	const savedRotateZ = useSharedValue(rotateZ.value);

	const singleTap = Gesture.Tap()
		.maxDuration(250)
		// web で onStart が動作しなく、onBegin を利用すると !success の場合も反応するため、onFinalize で制御する
		.onFinalize((event, success) => {
			if (success) {
				if (onSingleTapFinalize) {
					runOnJS(onSingleTapFinalize)(event, success);
				}
			}
		});

	// 1本の指の移動処理
	const isPanGesturing = useSharedValue(false);
	const panGesture = Gesture.Pan()
		.enabled(isActive)
		.onBegin(() => {
			isPanGesturing.value = true;
		})
		.onUpdate((e) => {
			translateX.value = savedTranslateX.value + e.translationX / componentSize.width;
			translateY.value = savedTranslateY.value + e.translationY / componentSize.height;
		})
		.onEnd(() => {
			savedTranslateX.value = translateX.value;
			savedTranslateY.value = translateY.value;
			isPanGesturing.value = false;
		});

	// 2本の指の間隔を狭める・広げる処理
	const isPinchGesturing = useSharedValue(false);
	const pinchGesture = Gesture.Pinch()
		.enabled(isActive)
		.onBegin(() => {
			isPinchGesturing.value = true;
		})
		.onUpdate((e) => {
			scale.value = savedScale.value * e.scale;
		})
		.onEnd(() => {
			savedScale.value = scale.value;
			isPinchGesturing.value = false;
		});

	// 2本指でタッチして回転させる処理
	const isRotationGesturing = useSharedValue(false);
	const rotationGesture = Gesture.Rotation()
		.enabled(isActive)
		.onBegin(() => {
			isRotationGesturing.value = true;
		})
		.onUpdate((e) => {
			rotateZ.value = savedRotateZ.value + e.rotation;
		})
		.onEnd(() => {
			savedRotateZ.value = rotateZ.value;
			isRotationGesturing.value = false;
		});

	// onEndGesture を定義する
	useAnimatedReaction(
		() => [isPanGesturing.value, isPinchGesturing.value, isRotationGesturing.value],
		(prepareResult, preparePreviousResult) => {
			if (preparePreviousResult && preparePreviousResult.some((x) => x) && prepareResult.every((x) => !x)) {
				runOnJS(Logger)('TCO001GestureProvider', 'useAnimatedReaction', 'onEndGesture');
				runOnJS(onEndGesture)({ translateX, translateY, scale, rotateZ });
			}
		},
		[onEndGesture],
	);

	const composed = useMemo(
		() => Gesture.Simultaneous(singleTap, panGesture, pinchGesture, rotationGesture),
		[panGesture, pinchGesture, rotationGesture, singleTap],
	);

	return <GestureDetector gesture={composed}>{children}</GestureDetector>;
};
