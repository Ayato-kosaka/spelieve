import { StyleSheet } from 'react-native';

import { materialColors } from '@/ThemeProvider';

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
		backgroundColor: materialColors.grey['50'],
	},
	tagsChipText: {
		color: materialColors.grey[800],
	},
	startDateComtainer: { zIndex: 1, alignItems: 'flex-start' },
	startDateLabel: { color: materialColors.grey[700] },
	startDateTimePicker: { backgroundColor: '#fff' },
	captionTextInput: {
		height: 400,
		marginBottom: 400,
		backgroundColor: '#fff',
	},
});
