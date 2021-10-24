import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import nookies from "nookies";

import firebase from "firebase/app";
import { adminApp } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";

import Container from "../components/Container";
import Navbar from "../components/Navbar";

export default function Settings(props) {

  const [savings, setSavings] = useState("");

  const [data, setData] = useState({});

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}`).on("value", function (data) { try { setData(data.val()) } catch (err) { console.log(err) } });
    setSavings(data.savings)
  }, []);

  function update() {
    firebase.database().ref(`users/${props.session}`).update({
      savings: parseFloat(savings)
    });
  }

  if (props.session) {
    return (
      <Container>
        <Navbar />
        <h1>Settings</h1>
        <p>Monthly savings</p>
        <motion.input onChange={(e) => setSavings(e.target.value)} value={savings} placeholder="Monthly savings" whileFocus={{ scale: 1.1 }} />
        <motion.button onClick={update} disabled={!savings} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Update</motion.button>
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
    context.res.writeHead(302, { Location: "/" });
    context.res.end();

    return { props: {} };
  }
}