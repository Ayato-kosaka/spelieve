import { useCallback, useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

import { TCO001CalcAnimatedGesture } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';

export const TMC02302MaskedDecoration = ({
	decorationID,
	value,
	onSourceLoad,
	containerSize,
}: MaskedDecorationPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	const maskRef = useRef<HTMLImageElement>(null);
	const { getTranslateX, getTranslateY, getScale } = TCO001CalcAnimatedGesture({
		canvasSize: containerSize,
		componentSize: {
			// mask 画像のサイズは、containerSize の小さい方に合わせた正方形とする
			// maskTransform.scale によって、mask 画像のサイズが変わる
			width: Math.min(containerSize.width, containerSize.height) * (decoration?.maskTransform.scale || 0),
			height: Math.min(containerSize.width, containerSize.height) * (decoration?.maskTransform.scale || 0),
		},
	});
	const setMasRef = useCallback(() => {
		if (!maskRef.current) return;
		maskRef.current.style.webkitMaskRepeat = 'no-repeat';
		maskRef.current.style.maskRepeat = 'no-repeat';
		maskRef.current.draggable = false;
		if (!decoration?.maskTransform) return;
		if (!decoration?.maskUri) return;
		maskRef.current.style.webkitMaskImage = `url(${decoration.maskUri})`;
		maskRef.current.style.maskImage = `url(${decoration.maskUri})`;
		const maskPosition = `${
			decoration.maskTransform.translateX * containerSize.width -
			(Math.min(containerSize.width, containerSize.height) * decoration.maskTransform.scale) / 2
		}px ${
			decoration.maskTransform.translateY * containerSize.height -
			(Math.min(containerSize.width, containerSize.height) * decoration.maskTransform.scale) / 2
		}px`;
		maskRef.current.style.maskPosition = maskPosition;
		maskRef.current.style.webkitMaskPosition = maskPosition;
		const maskSize = `auto ${decoration.maskTransform.scale * 100}%`;
		maskRef.current.style.webkitMaskSize = maskSize;
		maskRef.current.style.maskSize = maskSize;
	}, [containerSize.height, containerSize.width, decoration?.maskTransform, decoration?.maskUri]);
	useEffect(() => {
		if (!decoration) return;
		if (decoration.decorationType === 'Image') {
			const imageURI = value!;
			const image = new Image();
			image.src = imageURI;
			image.onload = () => {
				setMasRef();
				onSourceLoad();
			};
		}
		if (decoration.decorationType === 'Figure') {
			setMasRef();
		}
	}, [decoration, setMasRef, onSourceLoad, value]);

	if (!decoration) {
		return <View />;
	}
	return (
		<View>
			{decoration.decorationType === 'Figure' && (
				<div
					style={{
						width: containerSize.width,
						backgroundColor: decoration.color,
						borderColor: decoration.borderColor,
						aspectRatio: decoration.aspectRatio,
						borderWidth: 1,
						borderStyle: 'solid',
					}}
					ref={maskRef}
				/>
			)}
			{decoration.decorationType === 'Image' && (
				<img
					src={value}
					alt="decoration"
					style={{
						width: containerSize.width,
						objectFit: 'cover',
						borderWidth: 1,
						borderColor: decoration.borderColor,
						borderStyle: 'solid',
					}}
					ref={maskRef}
				/>
			)}
		</View>
	);
};
