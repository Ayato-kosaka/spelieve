import MaskedView from '@react-native-masked-view/masked-view';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

import { TCO001GestureProvider } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProvider';
import { TCO001UseAnimatedStyle } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderController';

export const TPA001MaskDecoration = ({
	decoration,
	imageURI,
	maskUri,
	maskTransform,
	onEndMaskGesture,
	maskItemStyle,
}: MaskDecorationPropsInterface) => {
	const { onAnimating, animatedStyle } = TCO001UseAnimatedStyle();

	if (!decoration) {
		return <View />;
	}
	return (
		<TCO001GestureProvider initial={maskTransform} onEndGesture={onEndMaskGesture} onAnimating={onAnimating}>
			<MaskedView
				style={{
					width: '100%',
				}}
				maskElement={
					<Animated.Image
						source={{
							uri: maskUri,
						}}
						style={[
							{
								flex: 1,
							},
							animatedStyle,
						]}
						resizeMode="cover"
					/>
				}>
				{decoration.decorationType === 'Figure' && (
					<View style={[maskItemStyle, { backgroundColor: decoration.color }]} />
				)}
				{decoration.decorationType === 'Image' && (
					<Image
						source={{
							uri: imageURI,
						}}
						style={[maskItemStyle]}
						resizeMode="cover"
					/>
				)}
			</MaskedView>
		</TCO001GestureProvider>
	);
};
