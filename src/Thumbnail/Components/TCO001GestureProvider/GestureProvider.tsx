import React, { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from './GestureProviderPropsInterface';

export const TCO001GestureProvider = ({
	initial,
	onEnd,
	isActive,
	onSingleTapFinalize,
	viewStyle,
	children,
}: GestureProviderPropsInterface) => {
	/**
	 * translateX -> style に反映される translateX
	 * savedTranslateX ->  手を止めた状態の translateX
	 */
	console.log('TCO001GestureProvider.render');
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
				runOnJS(onSingleTapFinalize)(event, success);
			}
		});

	// 1本の指の移動処理
	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			if (isActive.value) {
				translateX.value = savedTranslateX.value + e.translationX;
				translateY.value = savedTranslateY.value + e.translationY;
			}
		})
		.onEnd(() => {
			savedTranslateX.value = translateX.value;
			savedTranslateY.value = translateY.value;
			console.log('panGesture.onEnd');
		});

	// 2本の指の間隔を狭める・広げる処理
	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			if (isActive.value) {
				scale.value = savedScale.value * e.scale;
			}
		})
		.onEnd(() => {
			savedScale.value = scale.value;
		});

	// 2本指でタッチして回転させる処理
	const rotationGesture = Gesture.Rotation()
		.onUpdate((e) => {
			if (isActive.value) {
				rotateZ.value = savedRotateZ.value + e.rotation;
			}
		})
		.onEnd(() => {
			savedRotateZ.value = rotateZ.value;
		});

	const gesture = Gesture.Manual()
		.onTouchesDown((e, manager) => {
			manager.activate();
		})
		.onTouchesUp((e, manager) => {
			if (e.numberOfTouches === 0) {
				manager.end();
			}
		})
		.onEnd((event, success) => {
			if (isActive.value) {
				runOnJS(onEnd)({
					translateX: translateX.value,
					translateY: translateY.value,
					scale: scale.value,
					rotateZ: rotateZ.value,
				});
			}
		});

	// animatedStyle を設定する
	const animatedStyle = useAnimatedStyle(() => ({
		position: 'absolute',
		borderWidth: isActive.value ? 1 : 0,
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

	const composed = useMemo(
		() => Gesture.Simultaneous(singleTap, panGesture, pinchGesture, rotationGesture, gesture),
		[gesture, panGesture, pinchGesture, rotationGesture, singleTap],
	);

	return (
		<GestureDetector gesture={composed}>
			<Animated.View style={[viewStyle, animatedStyle]}>{children}</Animated.View>
		</GestureDetector>
	);
};
