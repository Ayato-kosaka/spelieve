import { getFirestore, collection, doc, Firestore } from 'firebase/firestore';
import app from '@/Common/Endpoint/firebase';

// Firestoreのインスタンス作成
let db: Firestore = getFirestore(app);
export default db;
