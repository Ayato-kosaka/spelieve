interface TDB02Decorations {
	translateX: number;
	translateY: number;
	rotateZ: number;
	scale: number;
	order: number;
	color: string;
}

export type DecorationsMapInteface = TDB02Decorations;
export interface DecorationsMapValInteface {
	decorationsMap: {
		[key: string]: DecorationsMapInteface;
	};
	setDecorationsMap: React.Dispatch<
		React.SetStateAction<{
			[key: string]: DecorationsMapInteface;
		}>
	>;
	createDecolation: (data: Omit<DecorationsMapInteface, 'color' | 'order'>) => void;
}
