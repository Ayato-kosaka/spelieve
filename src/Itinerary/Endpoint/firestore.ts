import { getFirestore } from 'firebase/firestore';
import app from '@/Common/Endpoint/firebase';

// Firestoreのインスタンス作成
const db = getFirestore(app);
export default db;
