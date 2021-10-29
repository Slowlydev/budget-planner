import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import nookies from "nookies";

import firebase from "firebase/app";
import { adminApp } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";

import Container from "../components/Container";
import Navbar from "../components/Navbar"
import Popup from "../components/Popup";

function Item(props) {

  const [favorite, setFavorite] = useState(props.item.favorite);
  const [inBudgetList, setInBudgetList] = useState(props.item.inBudgetList);

  function update(type, value) {
    if (type === "favorite") {
      setFavorite(value)
      firebase.database().ref(`users/${props.session}/items/${props.item.key}`).update({
        favorite: value,
      });
    } else if (type === "budgetlist") {
      setInBudgetList(value)
      firebase.database().ref(`users/${props.session}/items/${props.item.key}`).update({
        inBudgetList: value,
      });
    }
  }

  function removeItem() {
    firebase.database().ref(`users/${props.session}/items/${props.item.key}`).remove();
  }

  return (
    <tr>
      <td>{props.item.name}</td>
      <td className="number">{props.item.cost}</td>
      <td><motion.input onChange={(e) => update("favorite", e.target.checked)} checked={favorite} type="checkbox" /></td>
      <td><motion.input onChange={(e) => update("budgetlist", e.target.checked)} checked={inBudgetList} type="checkbox" /></td>
      <td><motion.button className="red" onClick={removeItem} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>remove</motion.button></td>
    </tr>
  )
}

export default function Wishlist(props) {

  const [data, setData] = useState();
  const [popup, setPopup] = useState(false);

  const togglePopup = () => setPopup(!popup);

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}/items`).on("value", function (data) { try { setData(data.val()) } catch (err) { console.log(err) } });
  }, [props.session]);

  const wishlistitems = [];

  if (data) {
    for (const key in data) {
      wishlistitems.push({
        name: data[key].name,
        cost: data[key].cost,
        favorite: data[key].favorite,
        inBudgetList: data[key].inBudgetList,
        key: key
      });
    }
  }

  if (props.session) {
    return (
      <Container navbar>
        <h1>Wishlist</h1>
        <p>Add items that u would like to get and put then in your budgetlist. Also this is the place where u manage ur wishes/items</p>
        <motion.button onClick={togglePopup} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Add Item</motion.button>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Favorite?</th>
              <th>Budgetlist?</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {wishlistitems.map((item, index) => (
              <Item session={props.session} item={item} key={index} />
            ))}
          </tbody>

        </table>


        {popup && (
          <Popup toggle={togglePopup} session={props.session} />
        )}
      </Container>
    )
  } else {
    <Container>
      <Navbar />
      <h1>Loading...</h1>
    </Container>
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await adminApp().auth().verifyIdToken(cookies.token);
    const { uid } = token;
    return {
      props: { session: uid }
    };
  } catch (err) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();

    return { props: {} };
  }
}