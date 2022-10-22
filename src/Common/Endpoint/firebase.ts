// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAYtb1rAoK79tFFCsZQ2xE1Sst1J6B9cSo',
	authDomain: 'itinerary-4aee3.firebaseapp.com',
	projectId: 'itinerary-4aee3',
	storageBucket: 'itinerary-4aee3.appspot.com',
	messagingSenderId: '531959047364',
	appId: '1:531959047364:web:97fb0d5af96b4220855591',
	measurementId: 'G-SH76NQ1HFZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
initializeFirestore(app, {
	ignoreUndefinedProperties: true,
});

export default app;
