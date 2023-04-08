import MaskedView from '@react-native-masked-view/masked-view';
import { useContext, useMemo } from 'react';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

import { TCO003OutlineTextBorder } from '@/Thumbnail/Components/TCO003OutlineTextBorder/OutlineTextBorder';

export const TMC02302MaskedDecoration = ({
	decorationID,
	value,
	onSourceLoad,
	containerSize,
}: MaskedDecorationPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	const maskTransform = useMemo(
		() =>
			decoration?.maskTransform
				? [
						{
							translateX: decoration.maskTransform.translateX * containerSize.width,
						},
						{
							translateY: decoration.maskTransform.translateY * containerSize.height,
						},
						{ scale: decoration.maskTransform.scale },
						{ rotateZ: `${(decoration.maskTransform.rotateZ / Math.PI) * 180}deg` },
				  ]
				: [],
		[containerSize.height, containerSize.width, decoration?.maskTransform],
	);

	if (!decoration) {
		return <View />;
	}

	return (
		<MaskedView
			style={{
				width: '100%',
				height: '100%',
			}}
			maskElement={
				decoration.maskUri ? (
					<Animated.Image
						source={{
							uri: decoration.maskUri,
						}}
						style={[
							{
								height: '100%',
								transform: maskTransform,
							},
						]}
						resizeMode="contain"
					/>
				) : (
					<View
						style={{
							backgroundColor: 'black',
							flex: 1,
						}}
					/>
				)
			}>
			{decoration.decorationType === 'Figure' && (
				<View
					style={[
						{
							width: containerSize.width,
							backgroundColor: decoration.color,
							borderColor: decoration.borderColor,
							aspectRatio: decoration.aspectRatio,
							borderWidth: 1,
							borderStyle: 'solid',
						},
					]}
				/>
			)}
			{decoration.decorationType === 'Image' && value && (
				<Image
					style={{
						width: containerSize.width,
						borderColor: decoration.borderColor,
						aspectRatio: decoration.aspectRatio,
						borderWidth: 1,
					}}
					source={{
						uri: value,
					}}
					onLoad={onSourceLoad}
					resizeMode="cover"
				/>
			)}
			{decoration.decorationType === 'Text' && value && (
				<TCO003OutlineTextBorder
					stroke={2}
					textShadowColor={decoration.borderColor}
					text={value}
					textProps={{
						style: {
							fontSize: 64,
							color: decoration.color,
							width: '100%',
							fontFamily: decoration.fontFamily,
						},
					}}
				/>
			)}
		</MaskedView>
	);
};
