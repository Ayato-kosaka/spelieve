import { useMemo } from 'react';
import styled from 'styled-components/native';

import { SourceMaskedViewPropsInterface } from './SourceMaskedViewInterface';

export const TCO002SourceMaskedView = ({ maskUri, ...viewProps }: SourceMaskedViewPropsInterface) => {
	// for more infomation about css_mask_image read https://www.webdesignleaves.com/pr/css/css_mask_image.html
	const StyledView = useMemo(
		() => styled.View`
			mask-image: url(${maskUri});
			mask-repeat: no-repeat;
			mask-position: 0% 0%;
			mask-size: auto 100%;
		`,
		[maskUri],
	);
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <StyledView {...viewProps} />;
};
