import React, { useState } from "react";
import db from "Components/fireB/firestore"
// import { withTranslation, WithTranslation } from "react-i18next";
import { useTranslation } from "react-i18next";
 
// class YsiList extends React.Component<WithTranslation> {
export const YsiList = () => {
  const [ysiList, setYsiList] = useState([]);
  const { t } = useTranslation();

  const setClick = () => {
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
 
  const getClick = () => {
    let data = [];
    db.collection('yasais').get().then(snapShot => {
      snapShot.forEach(doc => {
        data.push(doc.data());
      });
      setYsiList(data);
    });
  }
  
  return (
    <>
      <form id="ystForm">
        <label>
          Name:
          <input type="text" name="name" />
        </label>
      </form>
      <button onClick={setClick}>{t("野菜設定")}</button>
      
      <button onClick={getClick}>{t("野菜取得")}</button>
      {ysiList.map((val, i) => (
        <p key={`ysi${i}`}>{val.name}</p>
      ))}
    </>
  );
};