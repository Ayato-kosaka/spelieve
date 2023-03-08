export interface MaskedDecorationPropsInterface {
	decorationID: string;
	value: string | undefined;
	designItemStyle: {
		width: number | string;
		height: number | string;
	};
	onSourceLoad: () => void;
}
