import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import nookies from "nookies";

import { adminApp } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";

import Container from "../components/Container";

export default function Overview(props) {

  const router = useRouter();

  const [data, setData] = useState();

  firebaseClient();

  useEffect(() => {
    firebase.database().ref(`users/${props.session}/items`).on("value", function (data) { try { setData(data.val()) } catch (err) { console.log(err) } });
  }, [props.session]);

  const favorites = [];
  const recents = [];

  if (data) {
    for (const key in data) {
      if (data[key].favorite) {
        favorites.push({
          name: data[key].name,
          cost: data[key].cost
        });
      }
    }

    for (const key in data) {
      recents.push({
        name: data[key].name,
        cost: data[key].cost,
        dateAdded: data[key].dateAdded
      });
    }
  }

  recents.sort(function (a, b) {
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });

  async function signOut() {
    await firebase.auth().signOut();
    router.push("/");
  }

  if (props.session) {
    return (
      <Container navbar>
        <h1>Welcome back!</h1>
        <p>Here u can see your favorite items and your recently added items, u should definitly visit the settings page</p>
        <motion.button onClick={signOut} className="red" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Logout</motion.button>
        <h2>Favorites</h2>
        {favorites.map((item, index) => (
          <div className="item" key={index}>
            <p>{item.name}</p>
            <p className="number">{item.cost}</p>
          </div>
        ))}
        {!favorites.length && (
          <p>No favorites found, go ahead and add some</p>
        )}
        <h2>Recents</h2>
        {recents.slice(0, 3).map((item, index) => (
          <div className="item" key={index}>
            <p>{item.name}</p>
            <p className="number">{item.cost}</p>
          </div>
        ))}
        {!recents.length && (
          <p>No recenty added items found, go ahead and add some</p>
        )}
      </Container>
    )
  } else {
    return (
      <Container>
        <h1>Loading...</h1>
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