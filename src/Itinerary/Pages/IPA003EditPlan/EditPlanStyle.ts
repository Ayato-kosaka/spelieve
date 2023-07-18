import { StyleSheet } from 'react-native';

import { materialColors } from '@/ThemeProvider';

export const styles = StyleSheet.create({
	image: {
		aspectRatio: 16 / 9,
		backgroundColor: materialColors.grey[300],
		width: '100%',
	},
	memoTextInput: {
		backgroundColor: '#fff',
	},
	chipContainer: { flexDirection: 'row' },
	tagsChip: {
		backgroundColor: materialColors.grey['50'],
	},
	tagsChipText: {
		color: materialColors.grey[800],
	},
	spanLabel: { color: materialColors.grey[700] },
	spanTextInput: {
		backgroundColor: '#fff',
	},
	representativeStartDateTimeLabel: { color: materialColors.grey[700] },
	representativeStartDateTimePicker: { backgroundColor: '#fff' },
	setRepresentativeButtonLabel: { color: 'white', fontSize: 16 },
	captionTextInput: {
		height: 400,
		backgroundColor: '#fff',
	},
	materialCommunityIcons: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateY: -50 }, { translateX: -50 }],
		zIndex: 1,
	},
});
