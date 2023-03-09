import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TPA001FooterMenuController } from './FooterMenuController';

import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';

interface TPA001ColorPickerDialogControllerPropsInterface extends ThumbnailStackScreenProps<'TPA001ThumbnailEditor'> {
	selectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['selectedFooterMenu'];
	setSelectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['setSelectedFooterMenu'];
}

export const TPA001ColorPickerDialogController = ({
	navigation,
	route,
	selectedFooterMenu,
	setSelectedFooterMenu,
}: TPA001ColorPickerDialogControllerPropsInterface) => {
	const { decorationsMap, setDecorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);

	const [colorPickerDialog, setColorPickerDialog] = useState<{
		visible: boolean;
	}>({ visible: false });
	useEffect(() => {
		if (selectedFooterMenu === 'Color') {
			setColorPickerDialog({ visible: true });
		}
	}, [selectedFooterMenu]);
	const hideColorPickerDialog = useCallback(() => {
		setColorPickerDialog({ visible: false });
		setSelectedFooterMenu('');
	}, [setSelectedFooterMenu]);
	const onSaveColorPickerDialog = useCallback(
		(color: string) => () => {
			hideColorPickerDialog();
			if (!activeDecoration) {
				return;
			}
			setDecorationsMap((v) => ({
				...v,
				[activeDecorationID]: {
					...activeDecoration,
					color,
				},
			}));
		},
		[activeDecoration, activeDecorationID, hideColorPickerDialog, setDecorationsMap],
	);

	return {
		colorPickerDialog,
		hideColorPickerDialog,
		onSaveColorPickerDialog,
	};
};
