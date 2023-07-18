import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TPA001ColorPickerDialogPropsInterface } from './ColorPickerDialogInterface';

import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';

export const TPA001ColorPickerDialogController = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
}: TPA001ColorPickerDialogPropsInterface) => {
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

	const [color, setColor] = useState<string>('');
	useEffect(() => {
		if (activeDecoration?.color) setColor(activeDecoration?.color);
	}, [activeDecoration?.color]);

	return {
		activeDecoration,
		colorPickerDialog,
		hideColorPickerDialog,
		onSaveColorPickerDialog,
		color,
		setColor,
	};
};
