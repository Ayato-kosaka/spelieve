import { StyleSheet } from 'react-native';

import { materialColors, primaryColorNm } from '@/ThemeProvider';

export const styles = StyleSheet.create({
	image: { paddingTop: '100%', backgroundColor: materialColors.grey[300] },
	titleTextInput: {
		backgroundColor: '#fff',
	},
	subTitleTextInput: {
		backgroundColor: '#fff',
	},
	chipContainer: { flexDirection: 'row' },
	tagsChip: {
		backgroundColor: materialColors[primaryColorNm]['50'],
	},
	tagsChipText: {
		color: materialColors[primaryColorNm][400],
	},
	startDateLabel: { color: materialColors.grey[700] },
	startDateTimePicker: { backgroundColor: '#fff' },
	captionTextInput: {
		height: 400,
		backgroundColor: '#fff',
	},
});
