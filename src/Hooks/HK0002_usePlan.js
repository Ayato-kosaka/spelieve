import db from "Components/fireB/firestore"
import { doc, collection, query, where, getDoc, setDoc, getDocs, addDoc } from "firebase/firestore";


export class HK0002_Plan {
    static collectionName = 'Plans';
    
    constructor (doc){
    }
    async build(id){
        if(id){
            this.id = id;
            this.docRef = doc(db, HK0002_Plan.collectionName, id);
            const docSnap = await getDoc(this.docRef);
            if (!docSnap.exists()) {
                console.log("No such document!");
                return(new HK0002_Plan().build());
            }
            this.setter(docSnap.data());
        }else{
            this.docRef = await addDoc(collection(db, HK0002_Plan.collectionName), {});
            this.id = this.docRef.id;
        }
        return(this);
    }
    setData(data){
        this.setter(data);
        setDoc(this.docRef, data, { merge: true });
        return(this);
    }
    delete(){
        // await deleteDoc(this.doc));   
    }
    
    //private
    setter (data) {
        this.title = data.title;
        this.span = data.span;
    }
    
    static create(docRef){
        // new HK0002_Plan(await docRef.collection(this.collectionName).add());
    }
};