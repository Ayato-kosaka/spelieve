import React, { useContext, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Chip, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PlanEditPropsInterface } from 'spelieve-common/lib/Interfaces';
import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { IMC03101PlanEditController } from './PlanEditController';
import { styles } from './PlanEditStyle';

import { paperTheme } from '@/ThemeProvider';

export const IMC03101PlanEdit = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
}: PlanEditPropsInterface) => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);

	const { deletePlan, onPlanPress } = IMC03101PlanEditController({
		planID,
		beforeAfterRepresentativeType,
		dependentPlanID,
		planGroupsDoc,
		isPlanGroupMounted,
	});

	return (
		<Card style={{}}>
			<Card.Content
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<MaterialCommunityIcons
						name="map-marker"
						size={20}
						color={beforeAfterRepresentativeType === 'representative' ? paperTheme.colors.primary : 'black'}
					/>
				</View>
				<Pressable onPress={onPlanPress} style={{ flex: 13 }}>
					<Text>{plan.title || ' '}</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text>
							{DateUtils.formatToHHMM(plan.placeStartTime)}
							{plan.placeStartTime.getTime() !== plan.placeEndTime.getTime()
								? `~${DateUtils.formatToHHMM(plan.placeEndTime)}`
								: ''}
						</Text>
						<ScrollView horizontal>
							{plan.tags.map((tag, index) => (
								<Chip
									key={`${tag}${index.toString()}`}
									mode="outlined"
									style={styles.tagsChip}
									textStyle={styles.tagsChipText}>
									{tag}
								</Chip>
							))}
						</ScrollView>
					</View>
				</Pressable>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<MaterialCommunityIcons
						name="delete"
						size={20}
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							deletePlan();
						}}
					/>
				</View>
			</Card.Content>
		</Card>
	);
};
