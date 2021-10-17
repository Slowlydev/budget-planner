import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import nookies from "nookies";
import Link from "next/link";

import firebase from "firebase/app";
import { adminApp } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";

import Container from "../components/Container";
import Navbar from "../components/Navbar";

export default function Settings(props) {

  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

  const [data, setData] = useState({});

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}`).on("value", function (data) { try { setData(data.val()) } catch (err) { console.log(err) } });
  }, []);

  function update() {
    firebase.database().ref(`users/${props.session}`).update({
      montlyIncome: parseFloat(income),
      montlyExpenses: parseFloat(expense)
    });
  }

  if (props.session) {
    return (
      <Container>
        <Navbar />
        <h1>Settings</h1>
        <p>Monthly Income</p>
        <motion.input onChange={(e) => setIncome(e.target.value)} placeholder="Montly Income" whileFocus={{ scale: 1.1 }} />
        <p>Monthly Expenses</p>
        <motion.input onChange={(e) => setExpense(e.target.value)} placeholder="Montly expenses" whileFocus={{ scale: 1.1 }} />
        <motion.button onClick={update} disabled={!income || !expense} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Update</motion.button>
      </Container>
    )
  } else {
    <h1>Loading...</h1>
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
    //context.res.writeHead(302, { Location: "/" });
    //context.res.end();

    return { props: {} };
  }
}