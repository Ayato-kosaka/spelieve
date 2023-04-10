import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TPA001BorderColorPickerDialogPropsInterface } from './BorderColorPickerDialogInterface';

import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';

export const TPA001BorderColorPickerDialogController = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
}: TPA001BorderColorPickerDialogPropsInterface) => {
	const { decorationsMap, setDecorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);

	const [borderColorPickerDialog, setBorderColorPickerDialog] = useState<{
		visible: boolean;
	}>({ visible: false });
	useEffect(() => {
		if (selectedFooterMenu === 'BorderColor') {
			setBorderColorPickerDialog({ visible: true });
		}
	}, [selectedFooterMenu]);
	const hideColorPickerDialog = useCallback(() => {
		setBorderColorPickerDialog({ visible: false });
		setSelectedFooterMenu('');
	}, [setSelectedFooterMenu]);
	const onSaveColorPickerDialog = useCallback(
		(borderColor: string) => () => {
			hideColorPickerDialog();
			if (!activeDecoration) {
				return;
			}
			setDecorationsMap((v) => ({
				...v,
				[activeDecorationID]: {
					...activeDecoration,
					borderColor,
				},
			}));
		},
		[activeDecoration, activeDecorationID, hideColorPickerDialog, setDecorationsMap],
	);

	const [color, setColor] = useState<string>('');
	useEffect(() => {
		if (activeDecoration?.borderColor) setColor(activeDecoration?.borderColor);
		else setColor('transparent');
	}, [activeDecoration?.borderColor]);

	return {
		activeDecoration,
		colorPickerDialog: borderColorPickerDialog,
		hideColorPickerDialog,
		onSaveColorPickerDialog,
		color,
		setColor,
	};
};
