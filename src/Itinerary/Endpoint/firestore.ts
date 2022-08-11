import app from '@/Common/Endpoint/firebase';
import { getFirestore } from "firebase/firestore";

// Firestoreのインスタンス作成
const db = getFirestore(app);
export default db;