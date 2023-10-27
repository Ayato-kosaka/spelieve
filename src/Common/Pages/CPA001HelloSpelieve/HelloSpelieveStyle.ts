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

	// button: {
	// 	marginVertical: 16,
	// 	borderColor: 'black',
	// 	borderRadius: 50,
	// },
	// image: { paddingTop: '100%', backgroundColor: materialColors.grey[300] },
	// startDateComtainer: { zIndex: 1, alignItems: 'flex-start' },
	// startDateLabel: { color: materialColors.grey[700] },
	// startDateTimePicker: { backgroundColor: '#fff' },
	// captionTextInput: {
	// 	height: 300,
	// 	backgroundColor: '#fff',
	// },
	// materialCommunityIcons: {
	// 	position: 'absolute',
	// 	top: '50%',
	// 	left: '50%',
	// 	transform: [{ translateY: -50 }, { translateX: -50 }],
	// 	zIndex: 1,
	// },
});
