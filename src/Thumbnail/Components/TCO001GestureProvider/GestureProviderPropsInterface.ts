import { ReactNode } from 'react';

interface GestureProviderInterface {
	translateX: number;
	translateY: number;
	scale: number;
	rotateZ: number;
}

export interface GestureProviderPropsInterface {
	initial: GestureProviderInterface;
	onEnd: (val: Partial<GestureProviderInterface>) => void;
	children: ReactNode;
}
