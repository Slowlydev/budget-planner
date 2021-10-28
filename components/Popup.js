import { motion } from "framer-motion";
import { useState } from "react";

import firebase from "firebase/app";
import firebaseClient from "../firebaseClient";

let easing = [0.6, -0.05, 0.01, 0.99];

const fadeInUp = {
  initial: {
    y: 80,
    opacity: 0,
    transition: { duration: 0.6, ease: easing }
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: easing }
  }
};

export default function Popup(props) {

  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [inBudgetList, setInBudgetList] = useState(false);

  firebaseClient();

  function addItem() {

    const dateNow = new Date();

    firebase.database().ref(`users/${props.session}/items`).push({
      name: itemName,
      cost: Number.parseFloat(itemCost),
      dateAdded: dateNow.toUTCString(),
      inBudgetList: inBudgetList,
      favorite: favorite,
    });

    setItemName("");
    setItemCost();
    setFavorite(false);
    setInBudgetList(false);

    props.toggle();
  }

  function clear() {
    setItemName("");
    setItemCost("");
    setFavorite(false);
    setInBudgetList(false);
  }

  return (
    <div className="background">
      <motion.div className="popup" initial="initial" animate="animate" variants={fadeInUp} >
        <div className="header">
          <h1>Add Item</h1>
        </div>
        <div className="body">
          <motion.input onChange={(e) => setItemName(e.target.value)} value={itemName} type="text" placeholder="Item Name" tabindex="-1" whileFocus={{ scale: 1.1 }} />
          <motion.input onChange={(e) => setItemCost(e.target.value)} value={itemCost} type="number" placeholder="Item Cost" step="10" whileFocus={{ scale: 1.1 }} />
          <div className="checks">
            <label>Favorite?<motion.input onChange={(e) => setFavorite(e.target.checked)} checked={favorite} type="checkbox" /></label>
            <label>Add to Budgetlist?<motion.input onChange={(e) => setInBudgetList(e.target.checked)} checked={inBudgetList} type="checkbox" /></label>
          </div>
        </div>
        <div className="button-split">
          <motion.button onClick={clear} className="red" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Clear Inputs</motion.button>
          <div className="splitter" />
          <motion.button onClick={props.toggle} className="red" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Cancel</motion.button>
        </div>
        <motion.button className="button-fullsize" onClick={addItem} disabled={!itemName || !itemCost} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Add Item</motion.button>
      </motion.div>
    </div>
  )
}