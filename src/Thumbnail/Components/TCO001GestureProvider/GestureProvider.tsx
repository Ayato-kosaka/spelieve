import React, { useEffect, useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureProviderPropsInterface } from './GestureProviderPropsInterface';

export const TCO001GestureProvider = ({ initial, onEnd, children }: GestureProviderPropsInterface) => {
	/**
	 * translateX -> style に反映される translateX
	 * savedTranslateX ->  手を止めた状態の translateX
	 */
	console.log('TCO001GestureProvider.render');
	// TODO: 初期値に修正する
	const translateX = useSharedValue(initial.translateX);
	const translateY = useSharedValue(initial.translateY);
	const scale = useSharedValue(initial.scale);
	const rotateZ = useSharedValue(initial.rotateZ);
	const savedTranslateX = useSharedValue(translateX.value);
	const savedTranslateY = useSharedValue(translateY.value);
	const savedScale = useSharedValue(scale.value);
	const savedRotateZ = useSharedValue(rotateZ.value);

	const isActive = useSharedValue(false);
	const singleTap = Gesture.Tap()
		.maxDuration(250)
		// web で onStart が動作しないため、onBegin を利用する。違いは不明
		.onBegin(() => {
			console.log('singleTap.onBegin', isActive.value);
			isActive.value = !isActive.value;
		});

	// 1本の指の移動処理
	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			translateX.value = savedTranslateX.value + e.translationX;
			translateY.value = savedTranslateY.value + e.translationY;
		})
		.onEnd(() => {
			savedTranslateX.value = translateX.value;
			savedTranslateY.value = translateY.value;
			// onEnd({ translateX: translateX.value, translateY: translateY.value });
		});

	// 2本の指の間隔を狭める・広げる処理
	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			scale.value = savedScale.value * e.scale;
		})
		.onEnd(() => {
			savedScale.value = scale.value;
			// onEnd({ scale: scale.value });
		});

	// 2本指でタッチして回転させる処理
	const rotationGesture = Gesture.Rotation()
		.onUpdate((e) => {
			rotateZ.value = savedRotateZ.value + e.rotation;
		})
		.onEnd(() => {
			savedRotateZ.value = rotateZ.value;
			// onEnd({ rotateZ: rotateZ.value });
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

	const composed = useMemo(() => panGesture, [panGesture]);

	useEffect(() => {
		console.log('onEnd');
	}, [savedTranslateX.value, savedTranslateY.value, savedScale.value, savedRotateZ.value]);

	return (
		<GestureDetector gesture={composed}>
			<Animated.View style={animatedStyle}>{children}</Animated.View>
		</GestureDetector>
	);
};
