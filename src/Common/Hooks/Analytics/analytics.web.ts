import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// configure and initialize Firebase for web (copy this from the Firebase Console Project Settings for the exact values)
const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};

const app = initializeApp(firebaseConfig);
const webAnalytics = getAnalytics(app);

export async function sendAnalyticsEventAsync() {
  await logEvent(webAnalytics, "test_analytics_event", {
    additionaParam: "test",
  });
}