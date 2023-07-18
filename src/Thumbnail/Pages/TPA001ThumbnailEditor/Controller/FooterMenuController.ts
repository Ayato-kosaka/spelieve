import { Action } from 'expo-image-manipulator';
import { ImagePickerOptions } from 'expo-image-picker';
import { useCallback, useContext, useMemo, useState } from 'react';
import { GestureResponderEvent, PressableProps } from 'react-native';
import uuid from 'react-native-uuid';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import { CCO006ImagePickerController } from '@/Common/Components/CCO006ImagePicker/ImagePickerController';
import { consoleError } from '@/Common/Hooks/CHK001Utils';
import i18n from '@/Common/Hooks/i18n-js';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';
import { storage } from '@/Thumbnail/Endpoint/firebaseStorage';

export const TPA001FooterMenuController = ({
	imagePickerOptions,
	imageManipulatorActions,
}: {
	imagePickerOptions: ImagePickerOptions;
	imageManipulatorActions: Action[];
}) => {
	// パラメータ取得

	// グローバルコンテキスト取得
	const { setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	// コンテキスト取得
	const { decorationsMap, setDecorationsMap, createDecoration, activeDecorationID } = useContext(TCT023DecorationsMap);

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);
	const deleteDecoration = useCallback(
		(decorationID: string) => {
			const decoration = decorationsMap[decorationID];
			if (!decoration) {
				return;
			}
			setDecorationsMap((decolationsMap) => {
				// ReactのuseStateフックで作成したstateはイミュータブル（不変）であることが望ましいため、
				// stateを更新する際には常に新しいオブジェクトを作成する必要があります。
				const tmp = { ...decolationsMap };
				delete tmp[decorationID];
				return tmp;
			});
			if (decoration.decorationType === 'Text') {
				setThumbnailItemMapper((value) => {
					if (!decoration.key) {
						return value;
					}
					delete value.textMap[decoration.key];
					return value;
				});
			}
			if (decoration.decorationType === 'Image' || decoration.decorationType === 'Video') {
				setThumbnailItemMapper((value) => {
					if (!decoration.key) {
						return value;
					}
					delete value.storeUrlMap[decoration.key];
					return value;
				});
			}
		},
		[decorationsMap, setDecorationsMap, setThumbnailItemMapper],
	);

	const duplicationDecoration = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		const newDecoration = { ...activeDecoration };
		if (activeDecoration.decorationType === 'Text') {
			// duplicate text
			const key = uuid.v4() as string;
			setThumbnailItemMapper((value) => ({
				...value,
				textMap: {
					...value.textMap,
					[key]: value.textMap[activeDecoration.key!],
				},
			}));
			newDecoration.key = key;
		} else if (activeDecoration.decorationType === 'Image') {
			// duplicate image source url
			const key = uuid.v4() as string;
			setThumbnailItemMapper((v) => ({
				...v,
				storeUrlMap: {
					...v.storeUrlMap,
					[key]: v.storeUrlMap[activeDecoration.key!],
				},
			}));
			newDecoration.key = key;
		}
		createDecoration(newDecoration);
	}, [activeDecoration, createDecoration, setThumbnailItemMapper]);

	const bringToFront = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...activeDecoration,
				order:
					Object.keys(decorationsMap).reduce(
						(prev, key) => Math.max(prev, decorationsMap[key]!.order),
						Number.MIN_SAFE_INTEGER,
					) + 1,
			},
		});
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const bringForward = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		const targetID =
			Object.keys(decorationsMap)
				.filter((key) => decorationsMap[key]!.order > activeDecoration.order)
				.sort((keyA, keyB) => decorationsMap[keyA]!.order - decorationsMap[keyB]!.order)[0] || activeDecorationID;
		setDecorationsMap((x) => ({
			...x,
			[activeDecorationID]: {
				...activeDecoration,
				order: x[targetID]!.order,
			},
			[targetID]: {
				...x[targetID]!,
				order: activeDecoration.order,
			},
		}));
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const sendBackward = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		const targetID =
			Object.keys(decorationsMap)
				.filter((key) => decorationsMap[key]!.order < activeDecoration.order)
				.sort((keyA, keyB) => decorationsMap[keyB]!.order - decorationsMap[keyA]!.order)[0] || activeDecorationID;
		setDecorationsMap((x) => ({
			...x,
			[activeDecorationID]: {
				...activeDecoration,
				order: x[targetID]!.order,
			},
			[targetID]: {
				...x[targetID]!,
				order: activeDecoration.order,
			},
		}));
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const sendToBack = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		setDecorationsMap({
			...decorationsMap,
			[activeDecorationID]: {
				...activeDecoration,
				order:
					Object.keys(decorationsMap).reduce(
						(prev, key) => Math.min(prev, decorationsMap[key]!.order),
						Number.MAX_SAFE_INTEGER,
					) - 1,
			},
		});
	}, [activeDecoration, activeDecorationID, decorationsMap, setDecorationsMap]);

	const onPickImage = useCallback(
		(imageUrl: string) => {
			if (!activeDecoration?.key) {
				return;
			}
			const key = activeDecoration?.key;
			setThumbnailItemMapper((v) => ({
				...v,
				storeUrlMap: {
					...v.storeUrlMap,
					[key]: imageUrl,
				},
			}));
		},
		[activeDecoration?.key, setThumbnailItemMapper],
	);
	const { pickImage } = CCO006ImagePickerController({
		onPickImage,
		storage,
		imagePickerOptions,
		imageManipulatorActions,
	});
	const onPressReplace = useCallback(() => {
		if (!activeDecoration) {
			return;
		}
		if (activeDecoration.decorationType === 'Image') {
			pickImage().catch((e) => consoleError('TPA001FooterMenuController', 'onPressReplace', e));
		}
	}, [activeDecoration, pickImage]);

	const footerMenuList = useMemo(
		() => [
			{
				key: 'EditText' as const,
				title: i18n.t('EditText'),
				icon: 'format-text',
				onPress: () => {},
			},
			{ key: 'Replace' as const, title: i18n.t('Replace'), icon: 'file-replace-outline', onPress: onPressReplace },
			{ key: 'Color' as const, title: i18n.t('Color'), icon: 'palette-outline', onPress: () => {} },
			{ key: 'Mask' as const, title: i18n.t('Mask'), icon: 'content-cut', onPress: () => {} },
			{ key: 'Order' as const, title: i18n.t('Order'), icon: 'sort', onPress: () => {} },
			{ key: 'BorderColor' as const, title: i18n.t('Border Color'), icon: 'border-color', onPress: () => {} },
			{
				key: 'Duplicate' as const,
				title: i18n.t('Duplication'),
				icon: 'content-copy',
				onPress: duplicationDecoration,
			},
			{
				key: 'Delete' as const,
				title: i18n.t('Delete'),
				icon: 'delete',
				onPress: () => deleteDecoration(activeDecorationID),
			},
		],
		[activeDecorationID, deleteDecoration, duplicationDecoration, onPressReplace],
	);

	const [selectedFooterMenu, setSelectedFooterMenu] = useState<(typeof footerMenuList)[number]['key'] | ''>('');
	// useEffect(() => {
	// 	if(footerMenuList.find(footerMenu => footerMenu.key === selectedFooterMenu)?.)
	// 	setSelectedFooterMenu('')
	// }, [])
	const footerMenuOnPress = useCallback(
		(onPress: PressableProps['onPress'], selected: typeof selectedFooterMenu) => (event: GestureResponderEvent) => {
			setSelectedFooterMenu(selected);
			if (onPress) {
				onPress(event);
			}
		},
		[],
	);

	return {
		deleteDecoration,
		footerMenuList,
		selectedFooterMenu,
		setSelectedFooterMenu,
		footerMenuOnPress,
		bringToFront,
		bringForward,
		sendBackward,
		sendToBack,
	};
};
