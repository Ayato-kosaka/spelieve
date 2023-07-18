import React, { useContext, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as DateUtils from 'spelieve-common/lib/Utils/DateUtils';

import { ICT031PlansMap } from '../..';

import { IMC03101PlanEditController } from './PlanEditController';
import { PlanEditPropsInterface } from './PlanEditPropsInterface';

import i18n from '@/Common/Hooks/i18n-js';
import { paperTheme } from '@/ThemeProvider';

export const IMC03101PlanEdit = ({
	planID,
	beforeAfterRepresentativeType,
	planGroupsDoc,
	dependentPlanID,
	isPlanGroupMounted,
	planIndex,
	onPlanPress,
}: PlanEditPropsInterface) => {
	const { plansDocSnapMap } = useContext(ICT031PlansMap);
	const planDocSnap = useMemo(() => plansDocSnapMap[planID], [planID, plansDocSnapMap]);
	const plan = useMemo(() => planDocSnap.data(), [planDocSnap]);

	const { onSelectPlanMenu } = IMC03101PlanEditController({
		planID,
		beforeAfterRepresentativeType,
		dependentPlanID,
		planGroupsDoc,
		isPlanGroupMounted,
		planIndex,
	});

	return (
		<Card style={{}}>
			<Card.Content>
				<Pressable
					testID="planPressable"
					onPress={() => onPlanPress(planGroupsDoc.id, planID)}
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
					<View style={{ flex: 13 }}>
						<Text>{plan.title || ' '}</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text>
								{DateUtils.formatToHHMM(plan.placeStartTime)}
								{plan.placeStartTime.getTime() !== plan.placeEndTime.getTime()
									? `~${DateUtils.formatToHHMM(plan.placeEndTime)}`
									: ''}
							</Text>
						</View>
					</View>

					<Menu onSelect={onSelectPlanMenu}>
						<MenuTrigger>
							<MaterialCommunityIcons name="dots-horizontal" size={30} />
						</MenuTrigger>
						<MenuOptions customStyles={{ optionsWrapper: { backgroundColor: '#F8F8FF' } }}>
							<MenuOption value={{ command: 'up', planIndex }} text={i18n.t('上へ')} />
							<MenuOption value={{ command: 'down', planIndex }} text={i18n.t('下へ')} />
							<MenuOption value={{ command: 'delete' }} text={i18n.t('削除')} />
						</MenuOptions>
					</Menu>
				</Pressable>
			</Card.Content>
		</Card>
	);
};
