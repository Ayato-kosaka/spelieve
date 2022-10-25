import { StatusBar } from 'expo-status-bar';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { IPA000Test } from '@/Itinerary/Pages/IPA000Test';
import { PPA001Places } from './Place/Pages/PPA001Places/Places';
import { PPA002Place } from './Place/Pages/PPA002Place/Place'; 

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		// alignItems: 'center', // BUG: 入れると画面表示できなくなる!!!
		justifyContent: 'center',
	},
});

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <PaperProvider>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <StatusBar style='auto' />
          <Stack.Navigator initialRouteName='PPA001Places'>

            <Stack.Screen name='IPA000Test' component={IPA000Test} />
            <Stack.Screen name='PPA001Places'>
              {(props) => <PPA001Places  // TODO: 現在値or初期値決定して渡すべき
                    country='日本'
                    administrativeAreaLevel1='東京都'
                    administrativeAreaLevel2=''
                    locality='渋谷区'
                />
              }
            </Stack.Screen>

            <Stack.Screen name='PPA002Place'>
              {(props) => <PPA002Place
                    place_id={props.place_id}
                    language={props.language}
                />
              }
            </Stack.Screen>
          </Stack.Navigator>
        </View>
      </PaperProvider>
    </NavigationContainer>
  );
}

registerRootComponent(App);
