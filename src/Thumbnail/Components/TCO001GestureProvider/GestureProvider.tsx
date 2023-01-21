import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { GesturePropsInterface } from './GestureProviderPropsInterface';

export const TCO001GestureProvider = ({ translateX, translateY, scale, rotateZ, children }: GesturePropsInterface) => {
	const savedTranslateX = useSharedValue(0);
	const savedTranslateY = useSharedValue(0);
	const savedScale = useSharedValue(1);
	const savedRotateZ = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onBegin(() => {
			console.log('onBegin.translateX.value', translateX.value);
			savedTranslateX.value = translateX.value;
			savedTranslateY.value = translateY.value;
		})
		.onUpdate((e) => {
			console.log('panGesture.onUpdate', translateX.value, translateY.value);
			translateX.value = savedTranslateX.value + e.translationX;
			translateY.value = savedTranslateY.value + e.translationY;
		});

	const pinchGesture = Gesture.Pinch()
		.onBegin(() => {
			savedScale.value = scale.value;
		})
		.onUpdate((e) => {
			console.log('pinchGesture.onUpdate', e.scale);
			scale.value = savedScale.value * e.scale;
		});

	const rotationGesture = Gesture.Rotation()
		.onBegin(() => {
			savedRotateZ.value = rotateZ.value;
		})
		.onUpdate((e) => {
			console.log('rotationGesture.onUpdate', e.rotation);
			rotateZ.value = savedRotateZ.value + e.rotation;
		});

	return (
		<GestureDetector gesture={Gesture.Race(panGesture, pinchGesture, rotationGesture)}>{children}</GestureDetector>
	);
};
