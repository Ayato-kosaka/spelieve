interface TDB02Decorations {
	decorationType: 'Video' | 'Image' | 'Figure' | 'Line' | 'Text';
	translateX: number;
	translateY: number;
	rotateZ: number;
	scale: number;
	order: number;
	color: string;
	imageUrl?: string; // Image の時必須
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
