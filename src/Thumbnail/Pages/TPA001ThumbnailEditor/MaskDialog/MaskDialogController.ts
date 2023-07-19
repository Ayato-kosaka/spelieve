import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { Decorations } from 'spelieve-common/lib/Models/Thumbnail/TDB02/Decorations';

import { MaskDecorationPropsInterface } from './MaskDecoration/MaskDecorationInterface';
import { TPA001MaskDialogPropsInterface } from './MaskDialogInterface';

import { Logger } from '@/Common/Hooks/CHK001Utils';
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
		maskTransform: { translateX: 0.5, translateY: 0.5, scale: 1, rotateZ: 0 },
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
			maskTransform: { translateX: 0.5, translateY: 0.5, scale: 1, rotateZ: 0 },
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

	const [componentSize, setComponentSize] = useState<MaskDecorationPropsInterface['canvasSize']>({
		width: 0,
		height: 0,
	});

	const onLayout = useCallback((event: LayoutChangeEvent) => {
		Logger('MaskDialogController', 'onLayout', event.nativeEvent.layout);
		setComponentSize(event.nativeEvent.layout);
	}, []);

	return {
		maskDialog,
		onSelectMask,
		onEndMaskGesture,
		onSaveMaskDialog,
		hideMaskDialog,
		componentSize,
		onLayout,
	};
};
