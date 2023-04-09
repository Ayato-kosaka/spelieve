import { ComponentProps } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Text } from 'react-native-paper';

export interface OutlineTextBorderInterface {
	textShadowColor?: string;
	stroke: number;
	text: string;
	textProps: ComponentProps<typeof Text> | undefined;
	onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}
