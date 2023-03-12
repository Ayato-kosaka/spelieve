import { useCallback, useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

import { TCO003OutlineTextBorder } from '@/Thumbnail/Components/TCO003OutlineTextBorder/OutlineTextBorder';

export const TMC02302MaskedDecoration = ({
	decorationID,
	value,
	designItemStyle,
	onSourceLoad,
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
		maskRef.current.style.maskPosition = `${decoration.maskTransform.translateX}px ${decoration.maskTransform.translateY}px`;
		maskRef.current.style.webkitMaskPosition = `${decoration.maskTransform.translateX}px ${decoration.maskTransform.translateY}px`;
		// TODO: あとで変更する
		maskRef.current.style.webkitMaskSize = 'auto 100%';
		maskRef.current.style.maskSize = 'auto 100%';
	}, [decoration?.maskTransform, decoration?.maskUri]);
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
						backgroundColor: decoration.color,
						...designItemStyle,
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
						objectFit: 'cover',
						...designItemStyle,
						borderWidth: 1,
						borderColor: decoration.borderColor,
						borderStyle: 'solid',
					}}
					ref={maskRef}
				/>
			)}
			{decoration.decorationType === 'Text' && decoration.key && (
				<TCO003OutlineTextBorder
					stroke={2}
					textShadowColor={decoration.borderColor}
					text={value || 'Dummy Text'}
					textProps={{
						style: {
							fontSize: 64,
							color: decoration.color,
							width: '100%',
						},
					}}
				/>
			)}
		</View>
	);
};
