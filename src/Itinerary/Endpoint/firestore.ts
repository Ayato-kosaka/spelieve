import { getFirestore, collection, doc, Firestore } from 'firebase/firestore';
import app from '@/Common/Endpoint/firebase';

// Firestoreのインスタンス作成
let db: Firestore = getFirestore(app);
if(process.env.NODE_ENV==='development'){
    db = doc(collection(getFirestore(app), 'develop'), 'GOKyrRFVtAffj6kSzKIc') as unknown as Firestore;
}
console.log(process.env.NODE_ENV)
export default db;
