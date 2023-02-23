import { ReactNode } from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { AnimatedStyleProp, SharedValue } from 'react-native-reanimated';

export interface GestureProviderInterface {
	translateX: number;
	translateY: number;
	scale: number;
	rotateZ: number;
}

export interface GestureProviderPropsInterface {
	initial?: GestureProviderInterface;
	onEndGesture: (val: Partial<GestureProviderInterface>) => void;
	isActive?: boolean;
	onSingleTapFinalize?: (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>, success: boolean) => void;
	onAnimating?: (event: GestureProviderInterface) => void;
	animatedStyleShared?: SharedValue<AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle>>;
	viewStyle?: StyleProp<ViewStyle>;
	children: ReactNode;
}
