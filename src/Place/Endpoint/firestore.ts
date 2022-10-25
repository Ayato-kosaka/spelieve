import { getFirestore, collection, doc, Firestore } from 'firebase/firestore';
import app from '@/Common/Endpoint/firebase';

// Firestoreのインスタンス作成
const db: Firestore = getFirestore(app);
export default db;
