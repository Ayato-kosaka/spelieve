import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';

export const TPA001MaskDecoration = ({
	decoration,
	imageURI,
	maskUri,
	maskTransform,
	onEndMaskGesture,
}: MaskDecorationPropsInterface) => {
	const translateX = useSharedValue(maskTransform.translateX);
	const translateY = useSharedValue(maskTransform.translateY);
	const scale = useSharedValue(maskTransform.scale);
	const rotateZ = useSharedValue(maskTransform.rotateZ);

	const maskRef = useRef<HTMLImageElement>(null);
	const initMasRef = useCallback(() => {
		if (!maskRef.current) return;
		if (!maskUri) return;
		// for more infomation about css_mask_image read https://www.webdesignleaves.com/pr/css/css_mask_image.html
		maskRef.current.style.webkitMaskImage = `url(${maskUri})`;
		maskRef.current.style.maskImage = `url(${maskUri})`;
		maskRef.current.style.maskPosition = `${maskTransform.translateX}px ${maskTransform.translateY}px`;
		maskRef.current.style.webkitMaskPosition = `${maskTransform.translateX}px ${maskTransform.translateY}px`;
		maskRef.current.style.webkitMaskSize = 'auto 100%';
		maskRef.current.style.maskSize = 'auto 100%';
		maskRef.current.style.webkitMaskRepeat = 'no-repeat';
		maskRef.current.style.maskRepeat = 'no-repeat';
		maskRef.current.draggable = false;
	}, [maskTransform.translateX, maskTransform.translateY, maskUri]);
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
	}, [decoration, decoration?.maskUri, imageURI, initMasRef]);

	useAnimatedReaction(
		() => ({
			translateX: translateX.value,
			translateY: translateY.value,
			scale: scale.value,
			rotateZ: rotateZ.value,
		}),
		(prepareResult, preparePreviousResult) => {
			if (maskRef.current) {
				maskRef.current.style.maskPosition = `${prepareResult.translateX}px ${prepareResult.translateY}px`;
				maskRef.current.style.webkitMaskPosition = `${prepareResult.translateX}px ${prepareResult.translateY}px`;
				maskRef.current.style.webkitMaskSize = 'auto 100%';
				maskRef.current.style.maskSize = 'auto 100%';
				// TODO: rotate は、div.mask を分ける必要ある
			}
		},
		[translateX, translateY, scale, rotateZ],
	);

	if (!decoration) {
		return <View />;
	}
	return (
		<TCO001GestureProvider gesture={{ translateX, translateY, scale, rotateZ }} onEndGesture={onEndMaskGesture}>
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
