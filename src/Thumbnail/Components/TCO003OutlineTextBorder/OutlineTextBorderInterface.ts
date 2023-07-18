import { ComponentProps } from 'react';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

export interface OutlineTextBorderInterface {
	textShadowColor?: string;
	stroke: number;
	text: string;
	textProps: ComponentProps<typeof Text> | undefined;
	containerStyle?: StyleProp<ViewStyle>;
	onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}
