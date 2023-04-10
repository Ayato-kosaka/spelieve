import { useCallback, useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

export const TMC02302MaskedDecoration = ({
	decorationID,
	value,
	onSourceLoad,
	containerSize,
}: MaskedDecorationPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	const maskRef = useRef<HTMLImageElement>(null);
	const setMasRef = useCallback(() => {
		if (!maskRef.current) return;
		maskRef.current.style.webkitMaskRepeat = 'no-repeat';
		maskRef.current.style.maskRepeat = 'no-repeat';
		maskRef.current.draggable = false;
		if (!decoration?.maskTransform) return;
		if (!decoration?.maskUri) return;
		maskRef.current.style.webkitMaskImage = `url(${decoration.maskUri})`;
		maskRef.current.style.maskImage = `url(${decoration.maskUri})`;
		maskRef.current.style.maskPosition = `${decoration.maskTransform.translateX * containerSize.width}px ${
			decoration.maskTransform.translateY * containerSize.height
		}px`;
		maskRef.current.style.webkitMaskPosition = `${decoration.maskTransform.translateX * containerSize.width}px ${
			decoration.maskTransform.translateY * containerSize.height
		}px`;
		maskRef.current.style.webkitMaskSize = 'auto 100%';
		maskRef.current.style.maskSize = 'auto 100%';
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
						aspectRatio: decoration.aspectRatio,
						backgroundColor: decoration.color,
						borderWidth: 1,
						borderColor: decoration.borderColor,
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
