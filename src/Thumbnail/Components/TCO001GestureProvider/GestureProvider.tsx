import React, { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from './GestureProviderPropsInterface';

import { Logger } from '@/Common/Hooks/CHK001Utils';

export const TCO001GestureProvider = ({
	initial = {
		translateX: 0,
		translateY: 0,
		scale: 1,
		rotateZ: 0,
	},
	onEndGesture,
	isActive = true,
	onSingleTapFinalize,
	onAnimating,
	animatedStyleShared,
	viewStyle,
	children,
}: GestureProviderPropsInterface) => {
	/**
	 * translateX -> style に反映される translateX
	 * savedTranslateX ->  手を止めた状態の translateX
	 */
	const translateX = useSharedValue(initial.translateX);
	const translateY = useSharedValue(initial.translateY);
	const scale = useSharedValue(initial.scale);
	const rotateZ = useSharedValue(initial.rotateZ);
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
			translateX.value = savedTranslateX.value + e.translationX;
			translateY.value = savedTranslateY.value + e.translationY;
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
				runOnJS(onEndGesture)({
					translateX: translateX.value,
					translateY: translateY.value,
					scale: scale.value,
					rotateZ: rotateZ.value,
				});
			}
		},
		[onEndGesture],
	);

	// animatedStyle を設定する
	// const animatedStyle = useAnimatedStyle(() => ({
	// 	transform: [
	// 		{
	// 			translateX: translateX.value,
	// 		},
	// 		{
	// 			translateY: translateY.value,
	// 		},
	// 		{ scale: scale.value },
	// 		{ rotateZ: `${(rotateZ.value / Math.PI) * 180}deg` },
	// 	],
	// }));

	useAnimatedReaction(
		() => ({
			translateX: translateX.value,
			translateY: translateY.value,
			scale: scale.value,
			rotateZ: rotateZ.value,
		}),
		(prepareResult, preparePreviousResult) => {
			onAnimating?.(prepareResult);
			// console.log('useAnimatedReaction', maskRef.current, prepareResult);
			// if (maskRef.current) {
			// 	maskRef.current.style.maskPosition = `${prepareResult.translateX}px ${prepareResult.translateY}px`;
			// 	maskRef.current.style.webkitMaskPosition = `${prepareResult.translateX}px ${prepareResult.translateY}px`;
			// }
		},
		[translateX, translateY, scale, rotateZ],
	);

	const animatedStyle = useAnimatedStyle(() => animatedStyleShared?.value || {});

	const composed = useMemo(
		() => Gesture.Simultaneous(singleTap, panGesture, pinchGesture, rotationGesture),
		[panGesture, pinchGesture, rotationGesture, singleTap],
	);

	return (
		<GestureDetector gesture={composed}>
			<Animated.View style={[animatedStyle, viewStyle]}>{children}</Animated.View>
		</GestureDetector>
	);
};
