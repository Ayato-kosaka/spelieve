export interface MaskedDecorationPropsInterface {
	decorationID: string;
	value: string | undefined;
	designItemStyle: {
		width: number;
		height: number;
	};
	onSourceLoad: () => void;
}
