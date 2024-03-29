import { StyleSheet } from 'react-native';

import { materialColors } from '@/ThemeProvider';

export const styles = StyleSheet.create({
	button: {
		marginVertical: 16,
		borderColor: 'black',
		borderRadius: 50,
	},
	image: { paddingTop: '100%', backgroundColor: materialColors.grey[300] },
	startDateComtainer: { zIndex: 1, alignItems: 'flex-start', marginVertical: 10, marginHorizontal: 5 },
	startDateLabel: { color: materialColors.grey[700] },
	startDateTimePicker: { backgroundColor: '#fff' },
	captionTextInput: {
		height: 300,
		backgroundColor: '#fff',
		marginVertical: 10,
		marginHorizontal: 5,
	},
	dayNumber: {
		marginHorizontal: 5,
	},
	materialCommunityIcons: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateY: -50 }, { translateX: -50 }],
		zIndex: 1,
	},
});
