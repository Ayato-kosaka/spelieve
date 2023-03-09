import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TextEditDialogPropsInterface } from '../TextEditDialog/TextEditDialog';

import { TPA001FooterMenuController } from './FooterMenuController';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';

interface TPA001TextEditDialogControllerPropsInterface extends ThumbnailStackScreenProps<'TPA001ThumbnailEditor'> {
	selectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['selectedFooterMenu'];
	setSelectedFooterMenu: ReturnType<typeof TPA001FooterMenuController>['setSelectedFooterMenu'];
	deleteDecoration: ReturnType<typeof TPA001FooterMenuController>['deleteDecoration'];
}

export const TPA001TextEditDialogController = ({
	navigation,
	route,
	selectedFooterMenu,
	setSelectedFooterMenu,
	deleteDecoration,
}: TPA001TextEditDialogControllerPropsInterface) => {
	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	const { decorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);

	const [textEditDialog, setTextEditDialog] = useState<TextEditDialogPropsInterface['textEditDialog']>({
		visible: false,
		key: undefined,
	});
	const text = useMemo(
		() => (activeDecoration && activeDecoration.key && thumbnailItemMapper.textMap[activeDecoration.key]) || '',
		[activeDecoration, thumbnailItemMapper.textMap],
	);
	const hideTextEditDialog = useCallback(() => {
		setTextEditDialog({ visible: false, key: undefined });
		setSelectedFooterMenu('');
	}, [setSelectedFooterMenu]);
	const onSaveTextEditing = useCallback(
		(t: string) => () => {
			if (!textEditDialog.key) {
				return;
			}

			if (t) {
				const textMapKey = textEditDialog.key;
				setThumbnailItemMapper((value) => ({
					...value,
					textMap: {
						...value.textMap,
						[textMapKey]: t,
					},
				}));
			} else {
				const targetID = Object.keys(decorationsMap).find((id) => decorationsMap[id]!.key === textEditDialog.key);
				if (targetID) {
					deleteDecoration(targetID);
				}
			}
			hideTextEditDialog();
		},
		[decorationsMap, deleteDecoration, hideTextEditDialog, setThumbnailItemMapper, textEditDialog.key],
	);
	useEffect(() => {
		if (selectedFooterMenu === 'EditText') {
			if (!activeDecoration || !activeDecoration.key) {
				return;
			}
			setTextEditDialog({
				visible: true,
				key: activeDecoration.key,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFooterMenu]);

	return {
		textEditDialog,
		text,
		hideTextEditDialog,
		onSaveTextEditing,
	};
};
