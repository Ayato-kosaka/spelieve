import React, { useContext } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

import { TPA001MaskDialogController } from './MaskDialogController';
import { TPA001MaskDialogPropsInterface } from './MaskDialogInterface';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import i18n from '@/Common/Hooks/i18n-js';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { TCT032MMaskShapeList } from '@/Thumbnail/Contexts/TCT032MMaskShapeList/MMaskShapeList';
import { TPA001MaskDecoration } from '@/Thumbnail/Pages/TPA001ThumbnailEditor/MaskDialog/MaskDecoration/MaskDecoration';

export const TPA001MaskDialog = ({ selectedFooterMenu, setSelectedFooterMenu }: TPA001MaskDialogPropsInterface) => {
	// グローバルコンテキスト取得
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	// コンテキスト取得
	const { decorationsMap } = useContext(TCT023DecorationsMap);
	const { maskShapeList, isLoading } = useContext(TCT032MMaskShapeList);

	const { maskDialog, onEndMaskGesture, onSaveMaskDialog, maskItemStyle, hideMaskDialog } = TPA001MaskDialogController({
		selectedFooterMenu,
		setSelectedFooterMenu,
	});

	if (isLoading) {
		return <ActivityIndicator animating />;
	}

	return (
		<Portal>
			<Dialog visible={maskDialog.visible} onDismiss={onSaveMaskDialog}>
				<Dialog.Content>
					<TPA001MaskDecoration
						decoration={decorationsMap[maskDialog.decorationID]}
						imageURI={
							decorationsMap[maskDialog.decorationID] &&
							decorationsMap[maskDialog.decorationID]!.key &&
							thumbnailItemMapper.storeUrlMap[decorationsMap[maskDialog.decorationID]!.key!]
						}
						maskUri={maskDialog.maskUri}
						maskTransform={maskDialog.maskTransform}
						onEndMaskGesture={onEndMaskGesture}
						maskItemStyle={maskItemStyle}
					/>
					<View>
						{maskShapeList.map((maskShapeDoc) => {
							const maskShape = maskShapeDoc.data();
							return <Image key={maskShapeDoc.id} source={{ uri: maskShape.storageUrl }} />;
						})}
					</View>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideMaskDialog} color="black">
						{i18n.t('Cancel')}
					</Button>
					<Button onPress={onSaveMaskDialog} color="black">
						{i18n.t('Save')}
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
