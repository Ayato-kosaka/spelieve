import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import i18n from '../../Hooks/i18n-js';
import { RootStackScreenProps } from '@/Common/Navigation/NavigationInterface';
import { useCallback, useState } from 'react';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});

export const CPA002Extensions = ({ navigation }: RootStackScreenProps<'Extensions'>) => {
  const [result, setResult] = useState<string>('');
  const keys = ['CopyItinerary'] as const;
  const [input, setInput] = useState<{[key in typeof keys[number]]?: any}>({CopyItinerary:{}});
  const copyItinerary = useCallback(
		({itineraryID}:{itineraryID:string}): string => {
      return itineraryID;
		},
		[],
	);

  return (
	<View style={styles.container}>
    <Text>{result}</Text>
    <View>
  		<Text style={styles.title}>{keys[0]}</Text>
			<TextInput label={i18n.t('ItineraryID')} value={input[keys[0]].itineraryID} onChangeText={text => setInput(v => {v[keys[0]].itineraryID = text; return v; })} />
				<Button onPress={() => setResult(copyItinerary(input[keys[0]]))}>
					{i18n.t('Run')}
				</Button>
    </View>
	</View>
)}
