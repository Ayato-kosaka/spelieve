import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';

import { TPA001ColorPickerDialog } from './ColorPickerDialog/ColorPickerDialog';
import { TPA001ColorPickerDialogController } from './Controller/ColorPickerDialogController';
import { TPA001CreateDecorationController } from './Controller/CreateDecorationController';
import { TPA001FooterMenuController } from './Controller/FooterMenuController';
import { TPA001LeaveDialogController } from './Controller/LeaveDialogController';
import { TPA001MaskDialogController } from './Controller/MaskDialogController';
import { TPA001TextEditDialogController } from './Controller/TextEditDialogController';
import { TPA001TextEditDialog } from './TextEditDialog/TextEditDialog';
import { styles } from './ThumbnailEditorStyle';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT011MThumbnailOne } from '@/Thumbnail/Contexts/TCT011MThumbnailOne/ThumbnailOne';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { DecorationsMapInterface } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMapInterface';
import { TMC02301Decoration } from '@/Thumbnail/Contexts/TCT023DecorationsMap/ModelComponents/TMC02301Decoration/Decoration';
import { ThumnailRule } from '@/Thumbnail/Hooks/ThumbnailRule';
import { TPA001MaskDecoration } from '@/Thumbnail/Pages/TPA001ThumbnailEditor/MaskDecoration/MaskDecoration';

export const TPA001ThumbnailEditor = ({ navigation, route }: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	// パラメータ取得
	const { fromThumbnailID } = route.params;

	// グローバルコンテキスト取得
	const { thumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	// コンテキスト取得
	const { setThumbnailID } = useContext(TCT011MThumbnailOne);
	const { isLoading, decorationsMap, activeDecorationID } = useContext(TCT023DecorationsMap);

	const activeDecoration: DecorationsMapInterface | undefined = useMemo(
		() => decorationsMap[activeDecorationID],
		[activeDecorationID, decorationsMap],
	);

	// route.params.fromThumbnailID を監視し、context に渡す
	useEffect(() => {
		setThumbnailID(fromThumbnailID);
		if (!fromThumbnailID) {
			// TODO: テンプレート選択に画面遷移
		}
	}, [fromThumbnailID, setThumbnailID]);

	// Controller 呼び出し
	const { onTextPlusClicked, pickImage, onFigurePlusClicked } = TPA001CreateDecorationController({
		navigation,
		route,
	});
	const {
		viewShotRef,
		onLoadResolveMap,
		beforeLeaveDialog,
		hideBeforeLeaveDialog,
		onLeaveScreen,
		onSaveClicked,
		onDiscardClicked,
	} = TPA001LeaveDialogController({
		navigation,
		route,
	});
	const {
		deleteDecoration,
		footerMenuList,
		selectedFooterMenu,
		setSelectedFooterMenu,
		footerMenuOnPress,
		bringToFront,
		bringForward,
		sendBackward,
		sendToBack,
	} = TPA001FooterMenuController({
		navigation,
		route,
	});
	const { textEditDialog, text, hideTextEditDialog, onSaveTextEditing } = TPA001TextEditDialogController({
		navigation,
		route,
		selectedFooterMenu,
		setSelectedFooterMenu,
		deleteDecoration,
	});
	const { maskDialog, onEndMaskGesture, onSaveMaskDialog, maskItemStyle, hideMaskDialog } = TPA001MaskDialogController({
		navigation,
		route,
		selectedFooterMenu,
		setSelectedFooterMenu,
	});
	const { colorPickerDialog, hideColorPickerDialog, onSaveColorPickerDialog } = TPA001ColorPickerDialogController({
		navigation,
		route,
		selectedFooterMenu,
		setSelectedFooterMenu,
	});

	const headerRight = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				<MaterialCommunityIcons name="text-box-plus" size={30} onPress={onTextPlusClicked} />
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				<MaterialCommunityIcons name="image-plus" size={30} onPress={pickImage} />
				<MaterialCommunityIcons name="shape-rectangle-plus" size={30} onPress={onFigurePlusClicked} />
			</View>
		),
		[onFigurePlusClicked, onTextPlusClicked, pickImage],
	);
	const headerLeft = useCallback(
		() => (
			<View style={{ flexDirection: 'row' }}>
				<MaterialCommunityIcons name="close" size={30} onPress={onLeaveScreen} />
			</View>
		),
		[onLeaveScreen],
	);
	useEffect(() => {
		navigation.setOptions({
			headerRight,
			headerLeft,
		});
	}, [headerLeft, headerRight, navigation]);

	if (isLoading) {
		return <ActivityIndicator animating />;
	}

	return (
		<>
			<SafeAreaView />
			<Portal>
				{/* Mask ダイアログ */}
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
				{/* 閉じるボタン押下時に出現するダイアログ */}
				<Dialog visible={beforeLeaveDialog.visible} onDismiss={hideBeforeLeaveDialog}>
					<Dialog.Title>{i18n.t('Discard Thumbnail?')}</Dialog.Title>
					<Dialog.Content>
						<Text>{i18n.t('変更を保存せずに戻りますか？')}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideBeforeLeaveDialog} color="black">
							{i18n.t('Cancel')}
						</Button>
						<Button
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onPress={onSaveClicked}
							color="black">
							{i18n.t('Save')}
						</Button>
						<Button onPress={onDiscardClicked} color="red">
							{i18n.t('Discard')}
						</Button>
					</Dialog.Actions>
				</Dialog>

				<TPA001TextEditDialog
					textEditDialog={textEditDialog}
					textProps={text}
					hideTextEditDialog={hideTextEditDialog}
					onSaveTextEditing={onSaveTextEditing}
				/>

				{/* Color 選択時のダイアログ */}
				{activeDecoration && activeDecoration.color && (
					<TPA001ColorPickerDialog
						colorPickerDialog={colorPickerDialog}
						colorProps={activeDecoration.color}
						hideColorPickerDialog={hideColorPickerDialog}
						onSaveColorPickerDialog={onSaveColorPickerDialog}
					/>
				)}
			</Portal>
			<View style={{ height: '100%', justifyContent: 'space-between' }}>
				<Button
					onPress={() => {
						navigation.navigate('TPA002ThumbnailTemplate', {});
					}}>
					{i18n.t('go to select template')}
				</Button>

				{/* キャバス */}
				<ViewShot
					// TODO: resize する
					ref={viewShotRef}
					// options={{
					// 	result: 'base64',
					// }}
					style={{ width: '100%', aspectRatio: thumbnailItemMapper.aspectRatio, overflow: 'hidden', borderWidth: 1 }}>
					{Object.keys(decorationsMap).map((key) => (
						<TMC02301Decoration key={key} decorationID={key} onLoad={onLoadResolveMap[key]} />
					))}
				</ViewShot>

				{/* フッター */}
				<View>
					{/* フッター大分類 */}
					<ScrollView horizontal>
						{footerMenuList
							.filter(
								(footerMenu) =>
									activeDecoration && ThumnailRule.FooterDisplay()[activeDecoration.decorationType][footerMenu.key],
							)
							.map((footerMenu, index) => (
								<Pressable
									key={footerMenu.key}
									onPress={footerMenuOnPress(footerMenu.onPress, footerMenu.key)}
									style={{ width: 80 }}>
									<MaterialCommunityIcons name={footerMenu.icon} size={30} style={{ textAlign: 'center' }} />
									<Text style={{ textAlign: 'center' }}>{footerMenu.title}</Text>
								</Pressable>
							))}
					</ScrollView>

					{/* Order 選択時のフッターメニュー */}
					{selectedFooterMenu === 'Order' && (
						<View>
							<Pressable onPress={bringToFront} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-bring-to-front" size={20} />
								<Text>{i18n.t('Bring to Front')}</Text>
							</Pressable>
							<Pressable onPress={bringForward} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-bring-forward" size={20} />
								<Text>{i18n.t('Bring Forward')}</Text>
							</Pressable>
							<Pressable onPress={sendBackward} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-send-backward" size={20} />
								<Text>{i18n.t('Send Backward')}</Text>
							</Pressable>
							<Pressable onPress={sendToBack} style={styles.orderPressable}>
								<MaterialCommunityIcons name="arrange-send-to-back" size={20} />
								<Text>{i18n.t('Send to Back')}</Text>
							</Pressable>
						</View>
					)}
				</View>
			</View>
		</>
	);
};
