import { ReactNode } from 'react';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

export interface GestureProviderInterface {
	translateX: SharedValue<number>;
	translateY: SharedValue<number>;
	scale: SharedValue<number>;
	rotateZ: SharedValue<number>;
}

export interface GestureProviderPropsInterface {
	gesture: GestureProviderInterface;
	isActive?: boolean;
	onEndGesture: (val: Partial<GestureProviderInterface>) => void;
	onSingleTapFinalize?: (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>, success: boolean) => void;
	children: ReactNode;
	canvasSize: {
		width: number;
		height: number;
	};
}
