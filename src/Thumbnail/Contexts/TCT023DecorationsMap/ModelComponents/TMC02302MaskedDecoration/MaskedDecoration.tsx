import MaskedView from '@react-native-masked-view/masked-view';
import { useContext, useMemo } from 'react';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

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
	const { getTranslateX, getTranslateY, getScale, getRotateZ } = TCO001CalcAnimatedGesture({
		canvasSize: containerSize,
		componentSize: {
			// mask 画像のサイズは、containerSize の小さい方に合わせた正方形とする
			// View を利用する場合、maskTransform.scale によって、mask 画像のサイズが変わない
			width: Math.min(containerSize.width, containerSize.height),
			height: Math.min(containerSize.width, containerSize.height),
		},
	});
	const maskTransform = useMemo(
		() =>
			decoration?.maskTransform
				? [
						{
							translateX: getTranslateX(decoration.maskTransform.translateX),
						},
						{
							translateY: getTranslateY(decoration.maskTransform.translateY),
						},
						{ scale: getScale(decoration.maskTransform.scale) },
						{ rotateZ: getRotateZ(decoration.maskTransform.rotateZ) },
				  ]
				: [],
		[decoration?.maskTransform, getRotateZ, getScale, getTranslateX, getTranslateY],
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
		</MaskedView>
	);
};
