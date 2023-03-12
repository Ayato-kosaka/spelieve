import { Button, Dialog, TextInput, Portal } from 'react-native-paper';

import { TPA001TextEditDialogController } from './TextEditDialogController';
import { TPA001TextEditDialogPropsInterface } from './TextEditDialogInterface';

import i18n from '@/Common/Hooks/i18n-js';

export const TPA001TextEditDialog = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
	deleteDecoration,
}: TPA001TextEditDialogPropsInterface) => {
	const { textEditDialog, text, setText, hideTextEditDialog, onSaveTextEditing } = TPA001TextEditDialogController({
		selectedFooterMenu,
		setSelectedFooterMenu,
		deleteDecoration,
	});
	return (
		<Portal>
			<Dialog visible={textEditDialog.visible} onDismiss={onSaveTextEditing(text)}>
				<Dialog.Content>
					<TextInput
						mode="outlined"
						placeholder={i18n.t('テキストを入力してください')}
						value={text}
						onChangeText={(e) => setText(e)}
					/>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideTextEditDialog} color="black">
						{i18n.t('Cancel')}
					</Button>
					<Button
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onPress={onSaveTextEditing(text)}
						color="black">
						{i18n.t('Save')}
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
