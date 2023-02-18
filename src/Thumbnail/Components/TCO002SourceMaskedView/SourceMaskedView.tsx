import MaskedView from '@react-native-masked-view/masked-view';
import { Image, View } from 'react-native';

import { SourceMaskedViewPropsInterface } from './SourceMaskedViewInterface';

export const TCO002SourceMaskedView = ({ maskUri, ...viewProps }: SourceMaskedViewPropsInterface) => (
	<MaskedView
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...viewProps}
		maskElement={
			maskUri ? (
				<Image source={{ uri: maskUri }} style={{ width: '100%', paddingTop: '100%' }} />
			) : (
				<View style={{ flex: 1, backgroundColor: 'black' }} />
			)
		}
	/>
);
