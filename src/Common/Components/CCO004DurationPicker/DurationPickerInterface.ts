export interface DurationPickerPropsInterface {
	value: Date;
	onBlur: (newVal: Date) => Promise<void> | void;
}
