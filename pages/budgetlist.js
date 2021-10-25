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

  const [expenseArray, setExpenseArray] = useState([{ name: "", cost: 0 }]);
  let totalItemsCost = 0;

  const addTotalCost = (value) => { totalItemsCost = totalItemsCost + value };

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}/`).on("value", function (returnedData) {
      try {
        setData(returnedData.val());
        setIncome(returnedData.val().montlyIncome);
        setExpense(returnedData.val().montlyExpenses);
        setExpense(returnedData.val().expenseArray);
      } catch (err) { console.log(err) }
    });
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

  function calcAll() {
    let allCost = 0;

    for (const item of expenseArray) {
      allCost = allCost + parseFloat(item.cost);
    }

    return allCost;
  }

  function updateDB() {
    firebase.database().ref(`users/${props.session}`).update({
      montlyIncome: parseFloat(income),
      montlyExpenses: parseFloat(calcAll()),
      expenseArray: expenseArray
    });
  }

  function calculateMonth(cost) {
    const sparquote = data.montlyIncome - data.montlyExpenses;
    const nMonate = cost / sparquote;

    return Number.parseFloat(nMonate).toPrecision(2);
  }

  function update(value, index, prop) {
    let tempArray = expenseArray;
    let tempItem = { ...tempArray[index] };

    tempItem[prop] = value;
    tempArray[index] = tempItem;

    setExpenseArray(tempArray);
  }

  function add() {
    setExpenseArray([...expenseArray, { name: "", cost: 0 }]);
  }

  function calcDiff() {
    return data.montlyIncome - data.montlyExpenses;
  }

  if (props.session && data && data.items) {
    return (
      <Container navbar>
        <h1>Budgetlist</h1>
        <p>To buy all items in your list u would have to save for {calculateMonth(totalItemsCost)} months!</p>
        <div className="side-bar">
          <h2>Your Budget</h2>
          <p>Monthly Income</p>
          <motion.input onChange={(e) => setIncome(e.target.value)} value={income} placeholder="Montly Income" type="number" step='10' whileFocus={{ scale: 1.1 }} />
          <p>Monthly Expenses</p>
          <div className="col">
            {expenseArray.map((expense, index) => (
              <div className="input-row" key={index}>
                <motion.input className="fullwidth" onChange={(e) => update(e.target.value, index, "name")} value={expense.name} placeholder="Montly expense name" whileFocus={{ scale: 1.1 }} />
                <motion.input className="fullwidth" onChange={(e) => update(e.target.value, index, "cost")} placeholder="Montly expense cost" type="number" whileFocus={{ scale: 1.1 }} />
              </div>
            ))}
          </div>
          <p>Total Montly Expenses: {calcAll()}</p>
          <p>Amount that u can save: {calcDiff()}</p>
          <motion.button onClick={add} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Add expense</motion.button>
          <motion.button onClick={updateDB} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Update</motion.button>
        </div>
        {items.map((item, index) => (
          <div className="item" key={index}>
            <p>{item.name}</p>
            <p className="number">{item.cost}</p>
            <p>{calculateMonth(item.cost)} months</p>
          </div>
        ))}
      </Container>
    )
  } else if (data) {
    return (
      <Container>
        <Navbar />
        <div className="side-bar">
          <h2>Your Budget</h2>
          <p>Monthly Income</p>
          <motion.input onChange={(e) => setIncome(e.target.value)} value={income} placeholder="Montly Income" type="number" step='10' whileFocus={{ scale: 1.1 }} />
          <p>Monthly Expenses</p>
          <div className="col">
            {expenseArray.map((expense, index) => (
              <div className="input-row" key={index}>
                <motion.input className="fullwidth" onChange={(e) => update(e.target.value, index, "name")} placeholder="Montly expense name" whileFocus={{ scale: 1.1 }} />
                <motion.input className="fullwidth" onChange={(e) => update(e.target.value, index, "cost")} placeholder="Montly expense cost" type="number" whileFocus={{ scale: 1.1 }} />
              </div>
            ))}
          </div>
          <p>Total Montly Expenses: {calcAll()}</p>
          <p>Amount that u can save: {calcDiff()}</p>
          <motion.button onClick={add} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Add expense</motion.button>
          <motion.button onClick={updateDB} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Update</motion.button>
        </div>
        <h1>Loading...</h1>
        <p>It could be that u dont have any items yet, go to the wishlist and add some :)</p>
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