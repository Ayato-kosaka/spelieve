import db from "Components/fireB/firestore"
import HK0002_usePlan from 'Hooks/HK0002_usePlan'
import HK0003_usePlanGroup from 'Hooks/HK0003_usePlanGroup'

import { doc, collection, query, where, getDoc, setDoc, getDocs, addDoc } from "firebase/firestore";



export default class HK0001_useItinerary {
    static collectionName = 'Itineraries';
    
    constructor(){
        
    }
    async build(id){
        this.planGroups = [];
        let doc;
        if(id){
            this.id = id;
            doc = await getDoc(this.docRef());
        }
        if(doc && doc.data()!=='undefined'){
            this.setBody(doc.data());
        }else{
            let docRef = await addDoc(collection(db, HK0001_useItinerary.collectionName), {});
            this.id = docRef.id;
        }
        return(this);
    }
    update(data={}){
        this.setBody(data);
        setDoc(this.docRef(), this.getBody(), { merge: true });
    }
    copy(){
        let ret = new HK0001_useItinerary();
        Object.keys(this).forEach( (v) => {
            ret[v] = this[v];
        })
        return(ret);
    }
    
    //private
    setBody(data) {
        if(data.title !== undefined){
            this.title = data.title;
        }
    }
    getBody(){
        return({
            "title": this.title
        });
    }
    docRef() {
        return(doc(db, HK0001_useItinerary.collectionName, this.id));
    }
};
