import { View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';

import { TPA001ColorPickerDialogController } from './ColorPickerDialogController';
import { TPA001ColorPickerDialogPropsInterface } from './ColorPickerDialogInterface';

import i18n from '@/Common/Hooks/i18n-js';
import { materialColors } from '@/ThemeProvider';

export const TPA001ColorPickerDialog = ({
	selectedFooterMenu,
	setSelectedFooterMenu,
}: TPA001ColorPickerDialogPropsInterface) => {
	const { activeDecoration, colorPickerDialog, hideColorPickerDialog, onSaveColorPickerDialog, color, setColor } =
		TPA001ColorPickerDialogController({
			selectedFooterMenu,
			setSelectedFooterMenu,
		});

	return (
		<Portal>
			<Dialog visible={colorPickerDialog.visible} onDismiss={hideColorPickerDialog}>
				<Dialog.Title>{i18n.t('Color')}</Dialog.Title>
				<Dialog.Content>
					{activeDecoration?.color ? (
						<View style={{ height: 300 }}>
							<ColorPicker
								row={false}
								noSnap
								thumbSize={30}
								sliderSize={20}
								gapSize={30}
								discrete={false}
								discreteLength={undefined}
								sliderHidden={false}
								swatches
								swatchesLast={false}
								swatchesOnly={false}
								swatchesHitSlop={undefined}
								color={color}
								palette={[
									'#000',
									materialColors.grey[500],
									materialColors.red[700],
									materialColors.purple[700],
									materialColors.blue[700],
									materialColors.lightblue[700],
									materialColors.green[800],
									materialColors.lightgreen[700],
									materialColors.yellow[500],
									materialColors.orange[700],
								]}
								shadeWheelThumb
								shadeSliderThumb
								autoResetSlider={false}
								onInteractionStart={undefined}
								onColorChange={undefined}
								onColorChangeComplete={(v) => setColor(v)}
							/>
						</View>
					) : (
						<View />
					)}
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={hideColorPickerDialog} color="black">
						{i18n.t('Cancel')}
					</Button>
					<Button onPress={onSaveColorPickerDialog(color)} color="black">
						{i18n.t('Save')}
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
