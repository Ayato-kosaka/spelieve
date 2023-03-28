import { ComponentProps } from 'react';
import { Text } from 'react-native-paper';

export interface OutlineTextBorderInterface {
	textShadowColor?: string;
	stroke: number;
	text: string;
	textProps: ComponentProps<typeof Text> | undefined;
}
