import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { MaskDecorationPropsInterface } from './MaskDecoration/MaskDecorationInterface';
import { TPA001MaskDialogPropsInterface } from './MaskDialogInterface';

import { GestureProviderPropsInterface } from '@/Thumbnail/Components/TCO001GestureProvider/GestureProviderPropsInterface';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';
import { ThumnailRule } from '@/Thumbnail/Hooks/ThumbnailRule';

export const TPA001MaskDialogController = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
}: TPA001MaskDialogPropsInterface) => {
	const { decorationsMap, setDecorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

	const { decorationTypeFeature } = ThumnailRule;

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);
	const [maskDialog, setMaskDialog] = useState<{
		visible: boolean;
		decorationID: string;
		maskUri: Decorations['maskUri'];
		maskTransform: Decorations['maskTransform'];
	}>({
		visible: false,
		decorationID: '',
		maskUri: undefined,
		maskTransform: { translateX: 0, translateY: 0, scale: 1, rotateZ: 0 },
	});
	const onSelectMask = useCallback((maskUri: string) => {
		setMaskDialog((v) => ({ ...v, maskUri }));
	}, []);
	const maskItemStyle: MaskDecorationPropsInterface['maskItemStyle'] = useMemo(
		() =>
			activeDecoration
				? { ...decorationTypeFeature(activeDecoration).designItemStyle, width: '100%' }
				: { width: 0, aspectRatio: 0 },
		[activeDecoration, decorationTypeFeature],
	);
	useEffect(() => {
		if (selectedFooterMenu === 'Mask') {
			if (activeDecoration)
				setMaskDialog({
					visible: true,
					decorationID: activeDecorationID,
					// TODO: あとで変更する
					maskUri: activeDecoration.maskUri ?? 'https://cdn-icons-png.flaticon.com/512/2107/2107776.png',
					maskTransform: activeDecoration.maskTransform,
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFooterMenu]);
	const hideMaskDialog = useCallback(() => {
		setMaskDialog({
			visible: false,
			decorationID: '',
			maskUri: undefined,
			maskTransform: { translateX: 0, translateY: 0, scale: 1, rotateZ: 0 },
		});
		setSelectedFooterMenu('');
	}, [setSelectedFooterMenu]);
	const onEndMaskGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback((transorm) => {
		setMaskDialog((v) => ({ ...v, maskTransform: { ...v.maskTransform, ...transorm } }));
	}, []);
	const onSaveMaskDialog = useCallback(() => {
		setDecorationsMap((v) => ({
			...v,
			[maskDialog.decorationID]: v[maskDialog.decorationID]
				? {
						...v[maskDialog.decorationID]!,
						maskUri: maskDialog.maskUri,
						maskTransform: maskDialog.maskTransform,
				  }
				: undefined,
		}));
		hideMaskDialog();
	}, [hideMaskDialog, maskDialog.decorationID, maskDialog.maskTransform, maskDialog.maskUri, setDecorationsMap]);

	return {
		maskDialog,
		onEndMaskGesture,
		onSaveMaskDialog,
		maskItemStyle,
		hideMaskDialog,
	};
};
