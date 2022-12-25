// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { LogBox } from 'react-native';

import { ENV } from '@/ENV';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(ENV.FIREBASE_CONFIG);
if (process.env.NODE_ENV === 'production') {
	getAnalytics(app);
}
initializeFirestore(app, {
	ignoreUndefinedProperties: true,
});

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default app;
