import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001CalcAnimatedGesture } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';

export const TPA001MaskDecoration = ({
	decoration,
	imageURI,
	maskUri,
	maskTransform,
	onEndMaskGesture,
	canvasSize,
}: MaskDecorationPropsInterface) => {
	const translateX = useSharedValue(maskTransform.translateX);
	const translateY = useSharedValue(maskTransform.translateY);
	const scale = useSharedValue(maskTransform.scale);
	const rotateZ = useSharedValue(maskTransform.rotateZ);

	const { getTranslateX, getTranslateY, getScale } = TCO001CalcAnimatedGesture({
		canvasSize,
		componentSize: {
			// mask 画像のサイズは、canvasSize の小さい方に合わせた正方形とする
			// maskTransform.scale によって、mask 画像のサイズが変わる
			width: Math.min(canvasSize.width, canvasSize.height) * (decoration?.maskTransform.scale || 0),
			height: Math.min(canvasSize.width, canvasSize.height) * (decoration?.maskTransform.scale || 0),
		},
	});

	const maskRef = useRef<HTMLImageElement>(null);

	// ******************************************************
	// * maskRef を初期化する
	// ******************************************************
	const initMasRef = useCallback(() => {
		if (!maskRef.current) return;
		if (!maskUri) return;
		// for more infomation about css_mask_image
		// @see{https://developer.mozilla.org/ja/docs/Web/CSS/mask}
		const maskImage = `url(${maskUri})`;
		const maskPosition = `${getTranslateX(translateX.value)}px ${getTranslateY(translateY.value)}px`;
		const maskSize = `auto ${getScale(scale.value) * 100}%`;
		maskRef.current.style.maskImage = maskImage;
		maskRef.current.style.webkitMaskImage = maskImage;
		maskRef.current.style.maskPosition = maskPosition;
		maskRef.current.style.webkitMaskPosition = maskPosition;
		maskRef.current.style.webkitMaskSize = maskSize;
		maskRef.current.style.maskSize = maskSize;
		maskRef.current.style.webkitMaskRepeat = 'no-repeat';
		maskRef.current.style.maskRepeat = 'no-repeat';
		maskRef.current.draggable = false;
	}, [maskUri, getTranslateX, translateX, getTranslateY, translateY, getScale, scale]);

	// ******************************************************
	// * maskUri が変更されたら、maskRef を初期化する
	// ******************************************************
	useEffect(() => {
		if (!decoration) return;
		if (decoration.decorationType === 'Image') {
			if (imageURI === undefined) return;
			const image = new Image();
			image.src = imageURI;
			image.onload = () => {
				initMasRef();
			};
		}
		if (decoration.decorationType === 'Figure') {
			initMasRef();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageURI, maskUri]);

	// ******************************************************
	// * gesture による変更を反映する
	// ******************************************************
	useAnimatedReaction(
		() => ({
			translateX: translateX.value,
			translateY: translateY.value,
			scale: scale.value,
			rotateZ: rotateZ.value,
		}),
		(prepareResult, preparePreviousResult) => {
			const maskPosition = `${getTranslateX(prepareResult.translateX)}px ${getTranslateY(prepareResult.translateY)}px`;
			const maskSize = `auto ${getScale(prepareResult.scale) * 100}%`;
			if (maskRef.current) {
				maskRef.current.style.maskPosition = maskPosition;
				maskRef.current.style.webkitMaskPosition = maskPosition;
				maskRef.current.style.webkitMaskSize = maskSize;
				maskRef.current.style.maskSize = maskSize;
				// TODO: rotate は、div.mask を分ける必要ある
			}
		},
		[translateX, translateY, scale, rotateZ, canvasSize],
	);

	if (!decoration) {
		return <View />;
	}
	return (
		<TCO001GestureProvider
			gesture={{ translateX, translateY, scale, rotateZ }}
			onEndGesture={onEndMaskGesture}
			canvasSize={canvasSize}>
			<View>
				{decoration.decorationType === 'Figure' && (
					<div
						style={{
							width: '100%',
							maxHeight: 500,
							backgroundColor: decoration.color,
							aspectRatio: decoration.aspectRatio,
						}}
						ref={maskRef}
					/>
				)}
				{decoration.decorationType === 'Image' && (
					<img
						src={imageURI}
						alt="decoration"
						style={{
							width: '100%',
							maxHeight: 500,
							objectFit: 'cover',
						}}
						ref={maskRef}
					/>
				)}
			</View>
		</TCO001GestureProvider>
	);
};
