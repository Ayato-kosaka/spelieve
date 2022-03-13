import React from "react";
import db from "./fireB/firestore"
 
class YsiList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ysiList: []
    };
  }
  
  setClick = () => {
    var ysiName = document.getElementById("ystForm").elements["name"]["value"];
    console.log(ysiName)
    db.collection("yasais").add({name: ysiName})
      .then(function (docRef) {
        alert("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        alert("Error adding document: ", error);
      });
  }
 
  getClick = () => {
    let data = [];
    db.collection('yasais').get().then(snapShot => {
      snapShot.forEach(doc => {
        data.push(doc.data());
      });
      this.setState({ ysiList: data });
    });
  }
  
  render() {
    return <>
      <form id="ystForm">
        <label>
          Name:
          <input type="text" name="name" />
        </label>
      </form>
      <button onClick={this.setClick}>野菜設定</button>
      
      <button onClick={this.getClick}>野菜取得</button>
      {this.state.ysiList.map(val => (
        <p>{val.name}</p>
      ))}
    </>;
  }
}
 
export default YsiList;