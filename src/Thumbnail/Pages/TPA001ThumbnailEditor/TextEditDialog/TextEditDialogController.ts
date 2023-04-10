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

	const { decorationsMap, setDecorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

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

	const [fontFamily, setFontFamily] = useState('');
	const [text, setText] = useState<string>('');

	useEffect(() => {
		setText((activeDecoration?.key && thumbnailItemMapper.textMap[activeDecoration.key]) || '');
	}, [activeDecoration?.key, thumbnailItemMapper.textMap]);

	const hideTextEditDialog = useCallback(() => {
		setTextEditDialog({ visible: false, key: undefined });
		setSelectedFooterMenu('');
	}, [setSelectedFooterMenu]);

	const onSaveTextEditing = useCallback(() => {
		if (!textEditDialog.key || !activeDecoration) {
			return;
		}

		if (text) {
			const textMapKey = textEditDialog.key;
			setThumbnailItemMapper((value) => ({
				...value,
				textMap: {
					...value.textMap,
					[textMapKey]: text,
				},
			}));
			if (fontFamily) {
				setDecorationsMap((v) => ({
					...v,
					[activeDecorationID]: {
						...activeDecoration,
						fontFamily,
					},
				}));
			}
		} else {
			// 空文字に設定した場合は、Decoration を削除する。
			const targetID = Object.keys(decorationsMap).find((id) => decorationsMap[id]!.key === textEditDialog.key);
			if (targetID) {
				deleteDecoration(targetID);
			}
		}
		hideTextEditDialog();
	}, [
		activeDecoration,
		activeDecorationID,
		decorationsMap,
		deleteDecoration,
		fontFamily,
		hideTextEditDialog,
		setDecorationsMap,
		setThumbnailItemMapper,
		text,
		textEditDialog.key,
	]);

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
		setText,
		hideTextEditDialog,
		onSaveTextEditing,
		fontFamily,
		setFontFamily,
	};
};
