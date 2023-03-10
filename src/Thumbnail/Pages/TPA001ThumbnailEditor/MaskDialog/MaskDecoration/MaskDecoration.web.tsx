import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TPA001MaskDecoration = ({
	decoration,
	imageURI,
	maskUri,
	maskTransform,
	onEndMaskGesture,
	maskItemStyle,
}: MaskDecorationPropsInterface) => {
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

	const onAnimating = useCallback((event: GestureProviderInterface) => {
		'worklet';

		if (maskRef.current) {
			maskRef.current.style.maskPosition = `${event.translateX}px ${event.translateY}px`;
			maskRef.current.style.webkitMaskPosition = `${event.translateX}px ${event.translateY}px`;
			maskRef.current.style.webkitMaskSize = 'auto 100%';
			maskRef.current.style.maskSize = 'auto 100%';
			// TODO: rotate は、div.mask を分ける必要ある
		}
	}, []);
	if (!decoration) {
		return <View />;
	}
	return (
		<TCO001GestureProvider initial={maskTransform} onEndGesture={onEndMaskGesture} onAnimating={onAnimating}>
			<View>
				{decoration.decorationType === 'Image' && (
					<img
						src={imageURI}
						alt="decoration"
						style={{
							objectFit: 'cover',
							...maskItemStyle,
						}}
						ref={maskRef}
					/>
				)}
				{decoration.decorationType === 'Figure' && (
					<div style={{ backgroundColor: decoration.color, ...maskItemStyle }} ref={maskRef} />
				)}
			</View>
		</TCO001GestureProvider>
	);
};
