import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useEffect } from 'react';

import { BottomSheetPropsInterface } from './BottomSheetInterface';

export const CCO005BottomSheet = ({
	children,
	bottomSheetVisible,
	setBottomSheetVisible,
	onClose,
}: BottomSheetPropsInterface) => {
	// TODO: https://github.com/Ayato-kosaka/spelieve/issues/376 BottomSheetModal で背景が暗くならない

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['50%', '50%'], []);

	useEffect(() => {
		if (bottomSheetVisible) {
			bottomSheetModalRef.current?.present();
		} else {
			bottomSheetModalRef.current?.dismiss();
		}
	}, [bottomSheetVisible]);

	const onDismiss = useCallback(() => {
		setBottomSheetVisible(false);
		onClose();
	}, [setBottomSheetVisible, onClose]);

	return (
		<BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} onDismiss={onDismiss}>
			{children}
		</BottomSheetModal>
	);
};
