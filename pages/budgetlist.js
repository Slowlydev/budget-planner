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

  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

  let totalItemsCost = 0;

  const addTotalCost = (value) => { totalItemsCost = totalItemsCost + value };

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}/`).on("value", function (returnedData) { try { setData(returnedData.val()) } catch (err) { console.log(err) } });

    if (data && data.montlyIncome) {
      setIncome(data.montlyIncome);
    }
    if (data && data.montlyExpenses) {
      setExpense(data.montlyExpenses);
    }
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

  function update() {
    firebase.database().ref(`users/${props.session}`).update({
      montlyIncome: parseFloat(income),
      montlyExpenses: parseFloat(expense)
    });
  }

  function calculateMonth(cost) {
    const sparquote = data.montlyIncome - data.montlyExpenses;
    const nMonate = cost / sparquote;

    return Number.parseFloat(nMonate).toPrecision(2);
  }

  if (props.session && data && data.items) {
    return (
      <Container navbar>
        <h1>Budgetlist</h1>
        <p>To buy all items in your list u would have to save for {calculateMonth(totalItemsCost)} months!</p>
        <div className="budgetlist-split">
          {items.map((item, index) => (
            <div className="item" key={index}>
              <p>{item.name}</p>
              <p className="number">{item.cost}</p>
              <p>{calculateMonth(item.cost)} months</p>
            </div>
          ))}
          <div className="side-bar">
            <h2>Settings</h2>
            <p>Monthly Income</p>
            <motion.input onChange={(e) => setIncome(e.target.value)} value={income} placeholder="Montly Income" whileFocus={{ scale: 1.1 }} />
            <p>Monthly Expenses</p>
            <motion.input onChange={(e) => setExpense(e.target.value)} value={expense} placeholder="Montly expenses" whileFocus={{ scale: 1.1 }} />
            <motion.button onClick={update} disabled={!income || !expense} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Update</motion.button>
          </div>
        </div>
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