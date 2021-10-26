import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";

import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";

import { useAuth } from "../auth";

import Container from "../components/Container";

export default function Login() {

  firebaseClient();

  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    router.prefetch("/overview");
    if (user) {
      router.push("/overview");
    }
  });

  async function login() {
    setErrorMsg("");
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        router.push("/overview");
      })
      .catch(function (error) {
        setErrorMsg(error.message);
      });
  };

  async function sendPasswordEmail() {
		setErrorMsg("");
		await firebase
			.auth()
			.sendPasswordResetEmail(email)
			.then(function () {
				setErrorMsg("Email to reset Password has been sent!")
			})
			.catch(function (error) {
				setErrorMsg(error.message);
			});
	}

  return (
    <Container>
      <h1>Login</h1>
      <p>Login with your Budgetty account.</p>

      <motion.input onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" type="email" whileFocus={{ scale: 1.1 }} />
      <motion.input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" whileFocus={{ scale: 1.1 }} />

      <div className="row">
        <motion.button disabled={email === "" || password === ""} onClick={login} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Login</motion.button>
        <Link href="/">
          <a>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Back</motion.button>
          </a>
        </Link>
      </div>

      <motion.button onClick={sendPasswordEmail} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Reset Password</motion.button>

      {errorMsg && (
        <p>{errorMsg}</p>
      )}
    </Container>
  )
}