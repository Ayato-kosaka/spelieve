import MaskedView from '@react-native-masked-view/masked-view';
import { useContext, useMemo } from 'react';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { TCT023DecorationsMap } from '../../DecorationsMap';

import { MaskedDecorationPropsInterface } from './MaskedDecorationInterface';

import { useGetImageRatio } from '@/Common/Hooks/CHK001Utils';
import { TCO003OutlineTextBorder } from '@/Thumbnail/Components/TCO003OutlineTextBorder/OutlineTextBorder';

export const TMC02302MaskedDecoration = ({ decorationID, value, onSourceLoad }: MaskedDecorationPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	const decoration = decorationsMap[decorationID];
	const transform = useMemo(
		() =>
			decoration?.maskTransform
				? [
						{
							translateX: decoration.maskTransform.translateX,
						},
						{
							translateY: decoration.maskTransform.translateY,
						},
						{ scale: decoration.maskTransform.scale },
						{ rotateZ: `${(decoration.maskTransform.rotateZ / Math.PI) * 180}deg` },
				  ]
				: [],
		[decoration?.maskTransform],
	);

	const { aspectRatio } = useGetImageRatio(value);

	if (!decoration || (decoration.decorationType === 'Image' && aspectRatio === 0)) {
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
								flex: 1,
								transform,
							},
						]}
						resizeMode="cover"
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
							width: 100,
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
						width: 100,
						aspectRatio,
						borderWidth: 1,
						borderColor: decoration.borderColor,
					}}
					source={{
						uri: value,
					}}
					onLoad={onSourceLoad}
					resizeMode="cover"
				/>
			)}
			{decoration.decorationType === 'Text' && (
				<TCO003OutlineTextBorder
					stroke={2}
					textShadowColor={decoration.borderColor}
					text={value || 'Dummy Text'}
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
