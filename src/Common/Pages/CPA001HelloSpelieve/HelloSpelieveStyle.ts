import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	areaTitle: {
		fontSize: 20,
	},
	header: {
		backgroundColor: 'orange',
		flexDirection: 'row',
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	titleText: {
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
		marginLeft: 5,
		justifyContent: 'center',
	},
	headerBtnLabel: {
		color: 'black',
		fontSize: 15,
	},
	headerBtn: {
		paddingVertical: 8,
		width: '30%',
		textAlign: 'right',
		backgroundColor: 'white',
		position: 'absolute',
		top: 8,
		right: 3,
	},
	itineraryHistoriesArea: {
		width: '90%',
		marginHorizontal: 'auto',
		alignItems: 'center',
		marginTop: 15,
	},
	itineraryHistoryRow: {
		flexDirection: 'row',
	},
	commonDisplay: {
		alignItems: 'center',
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
		backgroundColor: '#f5f5f5',
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
		backgroundColor: 'orange',
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
		color: 'orange',
		fontWeight: 'bold',
	},
});
