import { StyleSheet } from 'react-native';

import { materialColors, secondaryColorNm } from '@/ThemeProvider';

export const styles = StyleSheet.create({
	infoContainer: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	materialCommunityIcons: {},
	infoText: {
		paddingLeft: 20,
	},
	urlLink: {
		color: materialColors[secondaryColorNm].a400,
	},
	openingHourText: {
		fontSize: 16,
		paddingVertical: 8,
	},
	ratingContainer: {
		marginVertical: 32,
		alignItems: 'center',
	},
	imageListContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	imageContainer: {
		width: '50%',
	},
	imageItem: {
		width: '100%',
		paddingTop: '100%',
	},
});
