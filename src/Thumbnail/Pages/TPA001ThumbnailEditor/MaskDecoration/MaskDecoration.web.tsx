import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TPA001MaskDecoration = ({ decoration, imageURI, onEndMaskGesture }: MaskDecorationPropsInterface) => {
	const maskRef = useRef<HTMLImageElement>(null);
	const initMasRef = useCallback(() => {
		if (!maskRef.current) return;
		// for more infomation about css_mask_image read https://www.webdesignleaves.com/pr/css/css_mask_image.html
		maskRef.current.style.webkitMaskImage = `url(${
			decoration?.maskUri ??
			// TODO: 後で変える
			'https://cdn-icons-png.flaticon.com/512/2107/2107776.png'
		})`;
		maskRef.current.style.maskImage = `url(${
			decoration?.maskUri ??
			// TODO: 後で変える
			'https://cdn-icons-png.flaticon.com/512/2107/2107776.png'
		})`;
		maskRef.current.style.webkitMaskRepeat = 'no-repeat';
		maskRef.current.style.maskRepeat = 'no-repeat';
		maskRef.current.style.webkitMaskSize = 'auto 100%';
		maskRef.current.style.maskSize = 'auto 100%';
		maskRef.current.draggable = false;
	}, [decoration?.maskUri]);
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
		<TCO001GestureProvider onEndGesture={onEndMaskGesture} onAnimating={onAnimating}>
			<View>
				<View />
				{decoration.decorationType === 'Image' && (
					<img
						src={imageURI}
						alt="decoration"
						style={{
							flex: 1,
							objectFit: 'cover',
						}}
						ref={maskRef}
					/>
				)}
				{decoration.decorationType === 'Figure' && <View />}
			</View>
		</TCO001GestureProvider>
	);
};
