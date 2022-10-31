import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IPA000Test } from "./IPA000Test";
import { TestPropsInterface } from "./IPA000Test/TestPropsInterface";

export type ItineraryStackParamList = {
  Test: TestPropsInterface;
}

const Stack = createNativeStackNavigator<ItineraryStackParamList>();

export function ItineraryPageNavigator() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Test" component={IPA000Test} />
    </Stack.Navigator>
  );
}