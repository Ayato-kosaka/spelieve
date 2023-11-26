import React, { useCallback } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import 'react-spring-bottom-sheet/dist/style.css';
import { BottomSheetPropsInterface } from './BottomSheet.interface';

export const CCO005BottomSheet = ({
	children,
	bottomSheetVisible,
	setBottomSheetVisible,
	onClose,
}: BottomSheetPropsInterface) => {
	const onDismiss = useCallback(() => {
		setBottomSheetVisible(false);
		onClose();
	}, [setBottomSheetVisible, onClose]);

	return (
		<BottomSheet open={bottomSheetVisible} onDismiss={onDismiss} snapPoints={({ minHeight }) => minHeight}>
			{children}
		</BottomSheet>
	);
};
