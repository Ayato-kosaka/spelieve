import React, { useCallback, useContext, useEffect } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';

import { TPA001TextEditDialog } from './TextEditDialog/TextEditDialog';
import { TPA001ThumbnailEditorController } from './ThumbnailEditorController';
import { styles } from './ThumbnailEditorStyle';

import { CCO001ThumbnailEditor } from '@/Common/Components/CCO001GlobalContext/GlobalContext';
import i18n from '@/Common/Hooks/i18n-js';
import { ThumbnailStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { TCT023DecorationsMap } from '@/Thumbnail/Contexts/TCT023DecorationsMap/DecorationsMap';
import { TMC02301Decoration } from '@/Thumbnail/Contexts/TCT023DecorationsMap/ModelComponents/TMC02301Decoration/Decoration';
import { ThumnailRule } from '@/Thumbnail/Hooks/ThumbnailRule';

export const TPA001ThumbnailEditor = ({ navigation, route }: ThumbnailStackScreenProps<'TPA001ThumbnailEditor'>) => {
	// グローバルコンテキスト取得
	const { thumbnailItemMapper, setThumbnailItemMapper } = useContext(CCO001ThumbnailEditor);

	// コンテキスト取得
	const { isLoading, decorationsMap } = useContext(TCT023DecorationsMap);

	const {
		activeDecoration,
		viewShotRef,
		onLoadResolveMap,
		beforeLeaveDialog,
		hideBeforeLeaveDialog,
		onLeaveScreen,
		onSaveClicked,
		onDiscardClicked,
		textEditDialog,
		hideTextEditDialog,
		onSaveTextEditing,
		text,
		footerMenuList,
		selectedFooterMenu,
		footerMenuOnPress,
		bringToFront,
		bringForward,
		sendBackward,
		sendToBack,
		onTextPlusClicked,
		pickImage,
		onFigurePlusClicked,
	} = TPA001ThumbnailEditorController({
		navigation,
		route,
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
