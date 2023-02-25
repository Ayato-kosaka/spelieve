import { ReactNode } from 'react';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';

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
	children: ReactNode;
}
