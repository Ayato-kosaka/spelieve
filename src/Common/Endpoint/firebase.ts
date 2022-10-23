// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

import { ENV } from '@/ENV';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(ENV.FIREBASE_CONFIG);
getAnalytics(app);
initializeFirestore(app, {
	ignoreUndefinedProperties: true,
});

export default app;
