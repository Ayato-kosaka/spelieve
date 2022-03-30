import db from "Components/fireB/firestore"


export class HK0002_Plan {
    static collectionName = 'Plans';
    
    constructor (doc){
        this.doc = doc;
        this.setter (doc.data());
    }
    setData(data){
        this.setter(data);
        // await setDoc(this.doc, data);
        // return(this);
    }
    delete(){
        // await deleteDoc(this.doc));   
    }
    
    //private
    setter (data) {
        this.title = data.title;
        this.span = data.span;
        this.prevPlanID = data.prevPlanID;
        this.nextPlanID = data.nextPlanID;
    }
    
    static create(docRef){
        // new HK0002_Plan(await docRef.collection(this.collectionName).add());
    }
};