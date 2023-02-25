import { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { GestureProviderInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';

export const TPA001MaskDecoration = ({ decoration, imageURI }: MaskDecorationPropsInterface) => {
	const maskRef = useRef<HTMLImageElement>(null);
	useEffect(() => {
		if (decoration?.maskUri === undefined) return;
		const image = new Image();
		image.src = decoration.maskUri;
		image.onload = () => {
			if (maskRef.current && decoration.maskUri) {
				// for more infomation about css_mask_image read https://www.webdesignleaves.com/pr/css/css_mask_image.html
				maskRef.current.style.webkitMaskImage = `url(${decoration.maskUri})`;
				maskRef.current.style.maskImage = `url(${decoration.maskUri})`;
				maskRef.current.style.webkitMaskRepeat = 'no-repeat';
				maskRef.current.style.maskRepeat = 'no-repeat';
				maskRef.current.style.webkitMaskSize = 'auto 100%';
				maskRef.current.style.maskSize = 'auto 100%';
				maskRef.current.draggable = false;
			}
		};
	}, [decoration?.maskUri]);

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
		<TCO001GestureProvider onEndGesture={() => {}} onAnimating={onAnimating}>
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
		</TCO001GestureProvider>
	);
};
