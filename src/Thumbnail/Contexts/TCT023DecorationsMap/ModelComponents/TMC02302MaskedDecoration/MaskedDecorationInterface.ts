export interface MaskedDecorationPropsInterface {
	decorationID: string;
	value: string | undefined;
	onSourceLoad: () => void;
	containerSize: { width: number; height: number };
}
