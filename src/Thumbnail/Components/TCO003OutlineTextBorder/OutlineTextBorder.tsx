import { useCallback } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { OutlineTextBorderInterface } from './OutlineTextBorderInterface';

export const TCO003OutlineTextBorder = ({
	textShadowColor,
	stroke,
	text,
	textProps,
	containerStyle,
	onLayout,
}: OutlineTextBorderInterface) => {
	const createClones = useCallback(
		(w: number, h: number) => {
			const currentProps = textProps;

			const newProps = {
				...currentProps,
				style: [
					currentProps?.style,
					{
						textShadowOffset: {
							width: w,
							height: h,
						},
						textShadowColor: textShadowColor || 'transparent',
						textShadowRadius: 1,
						whiteSpace: 'nowrap',
					},
				],
			};
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <Text {...newProps}>{text}</Text>;
		},
		[text, textProps, textShadowColor],
	);

	const strokeW = stroke;
	const top = createClones(0, -strokeW * 1.2);
	const topLeft = createClones(-strokeW, -strokeW);
	const topRight = createClones(strokeW, -strokeW);
	const right = createClones(strokeW, 0);
	const bottom = createClones(0, strokeW);
	const bottomLeft = createClones(-strokeW, strokeW);
	const bottomRight = createClones(strokeW, strokeW);
	const left = createClones(-strokeW * 1.2, 0);

	return (
		<View style={containerStyle}>
			<View onLayout={onLayout} style={{ position: 'absolute' }}>
				<View style={{ position: 'absolute' }}>{left}</View>
				<View style={{ position: 'absolute' }}>{right}</View>
				<View style={{ position: 'absolute' }}>{bottom}</View>
				<View style={{ position: 'absolute' }}>{top}</View>
				<View style={{ position: 'absolute' }}>{topLeft}</View>
				<View style={{ position: 'absolute' }}>{topRight}</View>
				<View style={{ position: 'absolute' }}>{bottomLeft}</View>
				{bottomRight}
			</View>
		</View>
	);
};
