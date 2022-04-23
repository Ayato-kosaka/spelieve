import db from "Components/fireB/firestore"
import { doc, collection, query, where, getDoc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import HK0001_useItinerary from 'Hooks/HK0001_useItinerary'


export default class HK0002_usePlan {
    static collectionName = 'Plans';
    
    constructor(itineraryId, id){
        this.itineraryId = itineraryId;
        this.id = id;
    }
    async create(){
        let docRef = await addDoc(collection(db, HK0001_useItinerary.collectionName, this.itineraryId, HK0002_usePlan.collectionName), {});
        this.id = docRef.id;
        this.update({"span": "00:00"})
        // this.startTime = new Date(1970, 1, 1, 0, 0, 0); //startTime はDBと乖離している。（書き方要検討）
        return(this);
    }
    update(data={}){
        this.setBody(data);
        setDoc(this.docRef(), this.getBody(), { merge: true });
    }
    delete(){
        deleteDoc(this.docRef());
    }

    //private
    setBody (data) {
        if(data.title !== undefined){
            this.title = data.title;
        }
        if(data.span !== undefined){
            this.span = (data.span instanceof Date) ? data.span : data.span.toDate();
        }
    }
    getBody(){
        let ret = {};
        if(this.title){ ret.title = this.title }
        if(this.span){ ret.span = this.span }
        return(ret);
    }
    docRef() {
        return(doc(db, HK0001_useItinerary.collectionName, this.itineraryId, HK0002_usePlan.collectionName, this.id));
    }

    //Class method
    static async getPlans(itineraryId){
        let ret = {};
        const querySnapshot = await db.collection(HK0001_useItinerary.collectionName).doc(itineraryId).collection(HK0002_usePlan.collectionName).get()
        querySnapshot.forEach(async (doc) => {
            let plan = new HK0002_usePlan(itineraryId, doc.id);
            plan.setBody(doc.data());
            // plan.startTime = new Date(1970, 1, 1, 0, 0, 0); //startTime はDBと乖離している。（書き方要検討）
            ret[plan.id] = plan;
        });
        return(ret);
    }
};