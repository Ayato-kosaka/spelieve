import { ScrollView } from 'react-native';
import { Button, Dialog, TextInput, Portal, List, useTheme } from 'react-native-paper';

import { TPA001TextEditDialogController } from './TextEditDialogController';
import { TPA001TextEditDialogPropsInterface } from './TextEditDialogInterface';

import i18n from '@/Common/Hooks/i18n-js';
import { materialColors } from '@/ThemeProvider';
import { THK001UseFonts } from '@/Thumbnail/Hooks/THK001UseFonts';

export const TPA001TextEditDialog = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
	deleteDecoration,
}: TPA001TextEditDialogPropsInterface) => {
	const { textEditDialog, text, setText, hideTextEditDialog, onSaveTextEditing, fontFamily, setFontFamily } =
		TPA001TextEditDialogController({
			selectedFooterMenu,
			setSelectedFooterMenu,
			deleteDecoration,
		});

	const theme = useTheme();

	const { FONTS, FONT_NAMES, fontsLoaded } = THK001UseFonts();
	return (
		<Portal>
			<Dialog visible={textEditDialog.visible} onDismiss={onSaveTextEditing}>
				<Dialog.Content>
					<TextInput
						mode="outlined"
						placeholder={i18n.t('テキストを入力してください')}
						value={text}
						onChangeText={(e) => setText(e)}
						style={{ fontFamily }}
					/>
					{fontsLoaded && (
						<ScrollView style={{ height: 500 }}>
							{FONT_NAMES.map((fontName) => (
								<List.Accordion
									key={fontName}
									title={fontName}
									titleStyle={{ fontFamily: `${fontName}_700Bold` }}
									theme={{
										...theme,
										colors: {
											...theme.colors,
											primary: 'black',
										},
									}}>
									{Object.keys(FONTS)
										.filter((x) => x.split('_')[0] === fontName)
										.map((font) => (
											<List.Item
												key={font}
												title={font}
												titleStyle={{ fontFamily: font }}
												onPress={() => setFontFamily(font)}
												style={{ paddingLeft: 20, backgroundColor: materialColors.grey[100] }}
											/>
										))}
								</List.Accordion>
							))}
						</ScrollView>
					)}
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideTextEditDialog} color="black">
						{i18n.t('Cancel')}
					</Button>
					<Button onPress={onSaveTextEditing} color="black">
						{i18n.t('Save')}
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
