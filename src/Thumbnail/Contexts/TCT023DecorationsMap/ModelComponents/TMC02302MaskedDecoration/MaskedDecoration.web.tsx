import { useCallback, useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

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
		if (!decoration?.maskTransform) return;
		if (!decoration?.maskUri) return;
		maskRef.current.style.webkitMaskImage = `url(${decoration.maskUri})`;
		maskRef.current.style.maskImage = `url(${decoration.maskUri})`;
		maskRef.current.style.maskPosition = `${decoration.maskTransform.translateX}px ${decoration.maskTransform.translateY}px`;
		maskRef.current.style.webkitMaskPosition = `${decoration.maskTransform.translateX}px ${decoration.maskTransform.translateY}px`;
		maskRef.current.style.webkitMaskSize = 'auto 100%';
		maskRef.current.style.maskSize = 'auto 100%';
		maskRef.current.style.webkitMaskRepeat = 'no-repeat';
		maskRef.current.style.maskRepeat = 'no-repeat';
		maskRef.current.draggable = false;
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
	}, [decoration, setMasRef, onSourceLoad, value]);

	if (!decoration) {
		return <View />;
	}
	return (
		<View>
			{decoration.decorationType === 'Figure' && (
				<View style={[designItemStyle, { backgroundColor: decoration.color }]} />
			)}
			{decoration.decorationType === 'Image' && (
				<img
					src={value}
					alt="decoration"
					style={{
						objectFit: 'cover',
						...designItemStyle,
					}}
					ref={maskRef}
				/>
			)}
			{decoration.decorationType === 'Text' && decoration.key && <Text>{value || 'Dummy Text'}</Text>}
		</View>
	);
};
