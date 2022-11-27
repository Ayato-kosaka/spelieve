import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	list: {
		flex: 1,
		flexDirection: 'row',
		// flexWrap: 'wrap',
		// position: 'absolute', scrollできなくなる
		top: -150,
		// marginHorizontal: 10,
		zIndex: -1,
		width: '100%',
		// marginTop: StatusBar.currentHeight || 0,
		// alignSelf: "center",
		// alignContentnItems: "flex-start",
	},
	image: {
		height: 200,
		width: 190,
		// marginHorizontal: 10,
	},
	placeName: {
		position: 'absolute',
		top: 0,
		left: 0,
		color: 'black',
		backgroundColor: 'darkgrey',
	},
});
