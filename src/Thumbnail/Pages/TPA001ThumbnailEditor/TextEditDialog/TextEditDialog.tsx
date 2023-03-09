import { useEffect, useState } from 'react';
import { Button, Dialog, TextInput } from 'react-native-paper';

import i18n from '@/Common/Hooks/i18n-js';

export interface TextEditDialogPropsInterface {
	textEditDialog: {
		visible: boolean;
		key: string | undefined;
	};
	textProps: string;
	hideTextEditDialog: () => void;
	onSaveTextEditing: (text: string) => () => void;
}

export const TPA001TextEditDialog = ({
	textEditDialog,
	textProps,
	hideTextEditDialog,
	onSaveTextEditing,
}: TextEditDialogPropsInterface) => {
	const [text, setText] = useState<string>('');
	useEffect(() => {
		setText(textProps);
	}, [textProps]);
	return (
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
	);
};
