import { ReactNode } from 'react';
import { View } from 'react-native';

export const AppProvider = ({ children }: { children: ReactNode }) => <View>{children}</View>;
