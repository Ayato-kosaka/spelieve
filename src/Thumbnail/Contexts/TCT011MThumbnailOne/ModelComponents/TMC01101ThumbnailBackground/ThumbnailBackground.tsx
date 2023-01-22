import { useContext } from 'react';
import { View } from 'react-native';

import { ThumbnailBackgroundPropsInterface } from './ThumbnailBackgroundInterface';

import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { TMC02301Decoration } from '@/Thumbnail/Contexts/TCT023DecorationsMap/ModelComponents/TMC02301Decoration/Decoration';

export const TMC01101ThumbnailBackground = ({ aspectRatio }: ThumbnailBackgroundPropsInterface) => {
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	return (
		<View style={{ width: '100%', aspectRatio, overflow: 'hidden', borderWidth: 1 }}>
			{Object.keys(decorationsMap).map((key) => (
				<TMC02301Decoration key={key} decorationID={key} />
			))}
		</View>
	);
};
