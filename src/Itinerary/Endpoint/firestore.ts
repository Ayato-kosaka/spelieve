import { getFirestore, collection, doc, Firestore } from 'firebase/firestore';

import app from '@/Common/Endpoint/firebase';

// Firestoreのインスタンス作成
let db: Firestore = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
	console.log(process.env.NODE_ENV);
	db = doc(collection(getFirestore(app), 'develop'), 'GOKyrRFVtAffj6kSzKIc') as unknown as Firestore;
}
export default db;
