export interface MaskedDecorationPropsInterface {
	decorationID: string;
	value: string | undefined;
	onSourceLoad: () => void;
	width: number;
}
