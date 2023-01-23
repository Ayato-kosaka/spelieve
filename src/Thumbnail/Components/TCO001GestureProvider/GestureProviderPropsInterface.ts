import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

interface GestureProviderInterface {
	translateX: number;
	translateY: number;
	scale: number;
	rotateZ: number;
}

export interface GestureProviderPropsInterface {
	initial: GestureProviderInterface;
	onEnd: (val: Partial<GestureProviderInterface>) => void;
	isActive: SharedValue<boolean>;
	onSingleTapFinalize: (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>, success: boolean) => void;
	viewStyle: StyleProp<ViewStyle>;
	children: ReactNode;
}
