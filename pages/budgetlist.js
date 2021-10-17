import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import nookies from "nookies";
import Link from "next/link";

import { adminApp } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";

import Container from "../components/Container";
import Navbar from "../components/Navbar";

export default function Overview(props) {

  const [data, setData] = useState();

  let totalItemsCost = 0;

  const addTotalCost = (value) => { totalItemsCost = totalItemsCost + value };

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}/`).on("value", function (data) { try { setData(data.val()) } catch (err) { console.log(err) } });
  }, []);

  const items = [];

  if (data && data.items) {
    for (const key in data.items) {
      if (data.items[key].inBudgetList) {
        items.push(data.items[key]);
        addTotalCost(data.items[key].cost);
      }
    }
  }

  function calculateMonth(cost) {
    const sparquote = data.montlyIncome - data.montlyExpenses;
    const nMonate = cost / sparquote;

    return Number.parseFloat(nMonate).toPrecision(2);
  }

  if (props.session && data) {
    return (
      <Container navbar>
        <h1>Budgetlist</h1>
        <p>To buy all items in your list u would have to save for {calculateMonth(totalItemsCost)} months!</p>
        {items.map(item => (
          <div className="item" key={items.name}>
            <p>{item.name}</p>
            <p className="number">{item.cost}</p>
            <p>{calculateMonth(item.cost)} months</p>
          </div>
        ))}
      </Container>
    )
  } else {
    return (
      <Container>
        <Navbar />
        <h1>Loading...</h1>
        <p>It could be that u dont have any items yet, go to the wishlist and add some :)</p>
      </Container>
    )
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