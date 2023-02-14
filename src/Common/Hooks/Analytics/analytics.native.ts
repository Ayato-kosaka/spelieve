import analytics from "@react-native-firebase/analytics";

export async function sendAnalyticsEventAsync() {
  await analytics().logEvent("test_analytics_event", {
    additionaParam: "test",
  });
}