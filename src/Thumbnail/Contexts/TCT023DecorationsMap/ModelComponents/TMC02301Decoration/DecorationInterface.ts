export interface DecorationPropsInterface {
	decorationID: string;
	onLoad?: (value: void) => void;
	canvasSize: {
		width: number;
		height: number;
	};
}
