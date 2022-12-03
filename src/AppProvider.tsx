import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ReactNode } from 'react';

export const AppProvider = ({ children }: { children: ReactNode }) => (
	<BottomSheetModalProvider>{children}</BottomSheetModalProvider>
);
