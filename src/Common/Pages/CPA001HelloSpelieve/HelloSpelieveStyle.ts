import { StyleSheet } from 'react-native';

import { materialColors } from '@/ThemeProvider';

export const styles = StyleSheet.create({
	header: {
		backgroundColor: materialColors.orange['500'],
		flexDirection: 'row',
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	headerTitleText: {
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
		marginLeft: 5,
		justifyContent: 'center',
	},
	headLineText: {
		textAlign: 'center',
	},
	simpleExplanation: {
		textAlign: 'center',
	},
	recentlyItineraryArea: {
		marginVertical: 20,
		width: '90%',
		marginHorizontal: 'auto',
	},
	recentlyItineraryScroll: {
		maxHeight: 700,
	},
	recentlyItineraryScrollContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	recentlyItineraryPressable: {
		width: '50%',
	},
	recentlyItineraryView: {
		borderWidth: 1,
		borderColor: materialColors.grey[400],
		borderRadius: 4,
		margin: 8,
	},
	recentlyItineraryImage: {
		paddingTop: '100%',
		width: '100%',
	},
	recentlyItineraryNoImageArea: {
		paddingTop: '100%',
		width: '100%',
		position: 'relative',
		overflow: 'hidden',
	},
	recentlyItineraryNoImageContent: {
		position: 'absolute',
		width: '100%',
		top: 0,
		bottom: 0,
		justifyContent: 'center',
	},
	recentlyItineraryNoImageText: {
		textAlign: 'center',
		flexWrap: 'wrap',
	},
	featuresArea: {
		alignItems: 'center',
		flexDirection: 'column',
	},
	featureImage: {
		width: 200,
		height: 200,
		marginVertical: 20,
	},
	featureTitle: {
		fontWeight: 'bold',
	},
	howToUseBox: {
		width: '70%',
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: materialColors.grey[50],
		borderRadius: 8,
		marginVertical: 10,
	},
	howToUseNumber: {
		borderRadius: 9999,
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		top: -10,
		left: -10,
		backgroundColor: materialColors.orange['500'],
		width: 40,
		height: 40,
		fontSize: 10,
	},
	howToUseNumberText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	howToUseText: {
		marginTop: 10,
		color: materialColors.orange['500'],
		fontWeight: 'bold',
	},
});