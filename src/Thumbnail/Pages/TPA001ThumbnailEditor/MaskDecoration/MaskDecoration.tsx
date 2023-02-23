import { useContext } from 'react';
import { View } from 'react-native';

import { TCT023DecorationsMap } from '../../../Contexts/TCT023DecorationsMap/DecorationsMap';

import { MaskDecorationPropsInterface } from './MaskDecorationInterface';

export const TPA001MaskDecoration = (props: MaskDecorationPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	console.log('decorationsMap', decorationsMap);
	return <View />;
};
