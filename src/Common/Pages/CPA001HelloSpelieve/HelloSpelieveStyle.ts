import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
	itineraryImage: {
		width: '40%',
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
	featureDescription: {},
	h2Text: {
		fontSize: 30,
	},
	howToUseBox: {
		width: '70%',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10
	}
});
