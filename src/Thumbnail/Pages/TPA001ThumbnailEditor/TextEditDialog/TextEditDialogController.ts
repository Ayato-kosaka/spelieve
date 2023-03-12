import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TPA001TextEditDialogPropsInterface } from './TextEditDialogInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';

export const TPA001TextEditDialogController = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
	deleteDecoration,
}: TPA001TextEditDialogPropsInterface) => {
	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	const { decorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);

	const [textEditDialog, setTextEditDialog] = useState<{
		visible: boolean;
		key: string | undefined;
	}>({
		visible: false,
		key: undefined,
	});
	const [text, setText] = useState<string>('');
	useEffect(() => {
		setText((activeDecoration && activeDecoration.key && thumbnailItemMapper.textMap[activeDecoration.key]) || '');
	}, [activeDecoration, thumbnailItemMapper.textMap]);
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

	const [fontFamily, setFontFamily] = useState('');

	return {
		textEditDialog,
		text,
		setText,
		hideTextEditDialog,
		onSaveTextEditing,
		fontFamily,
		setFontFamily,
	};
};
