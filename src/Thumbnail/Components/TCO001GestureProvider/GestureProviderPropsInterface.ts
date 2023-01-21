import { ReactNode } from 'react';
import { SharedValue } from 'react-native-reanimated';

export type AnimatedStyleInterface = {
	transform: [{ translateX: number }, { translateY: number }, { scale: number }, { rotateZ: string }];
};

export interface GesturePropsInterface {
	translateX: SharedValue<number>;
	translateY: SharedValue<number>;
	rotateZ: SharedValue<number>;
	scale: SharedValue<number>;
	children: ReactNode;
}
