import { View } from 'react-native';

export const IMC03102TrafficMovementEditTemplate = ({
	Mode,
	Time,
	AddPlan,
}: {
	Mode: React.ReactNode | undefined;
	Time: React.ReactNode | undefined;
	AddPlan: React.ReactNode | undefined;
}) => (
	<View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 4 }}>
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{Mode}</View>
		<View style={{ flex: 14, flexDirection: 'row' }}>
			<View style={{ flex: 3 }}>{Time}</View>
			<View style={{ flex: 11, flexDirection: 'row' }}>{AddPlan}</View>
		</View>
	</View>
);
