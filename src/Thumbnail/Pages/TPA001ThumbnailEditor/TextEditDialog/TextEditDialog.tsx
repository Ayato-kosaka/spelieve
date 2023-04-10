import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Dialog, TextInput, Portal, List, useTheme, Text } from 'react-native-paper';

import { TPA001TextEditDialogController } from './TextEditDialogController';
import {
	TPA001TextEditDialogPropsInterface,
	TPA001TextEditDialogTextInputPropsInterface,
} from './TextEditDialogInterface';

import i18n from '@/Common/Hooks/i18n-js';
import { materialColors } from '@/ThemeProvider';
import { THK001UseFonts } from '@/Thumbnail/Hooks/THK001UseFonts';

const TextEditDialogTextInput = ({ text, onBlur, style }: TPA001TextEditDialogTextInputPropsInterface) => {
	const [value, setValue] = useState('');
	useEffect(() => {
		setValue(text);
	}, [text]);
	return (
		<TextInput
			mode="outlined"
			value={value}
			onChangeText={(e) => setValue(e)}
			onBlur={() => onBlur(value)}
			placeholder={i18n.t('テキストを入力してください')}
			style={style}
		/>
	);
};

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
					<TextEditDialogTextInput
						text={text}
						onBlur={(t) => {
							setText(t);
						}}
						style={{ fontFamily }}
					/>
					<View style={{ flexDirection: 'row', overflow: 'hidden', height: 80, alignItems: 'center' }}>
						<Text style={{ fontSize: 20, marginRight: 5 }}>FontFamily: </Text>
						<Text style={{ fontFamily, fontSize: 20 }}>{fontFamily}</Text>
					</View>
					{fontsLoaded && (
						<ScrollView style={{ height: 450 }}>
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
