import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

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
	useEffect(() => {
		if (selectedFooterMenu === 'Mask') {
			if (activeDecoration)
				setMaskDialog({
					visible: true,
					decorationID: activeDecorationID,
					maskUri: activeDecoration.maskUri,
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
	const onEndMaskGesture: GestureProviderPropsInterface['onEndGesture'] = useCallback((val) => {
		setMaskDialog((v) => ({
			...v,
			maskTransform: {
				translateX: val.translateX?.value || v.maskTransform.translateX,
				translateY: val.translateY?.value || v.maskTransform.translateY,
				scale: val.scale?.value || v.maskTransform.scale,
				rotateZ: val.rotateZ?.value || v.maskTransform.rotateZ,
			},
		}));
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
		onSelectMask,
		onEndMaskGesture,
		onSaveMaskDialog,
		hideMaskDialog,
	};
};
