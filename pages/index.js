import { motion } from 'framer-motion';
import Link from "next/link";

import firebase from "firebase/app";
import { useAuth } from "../auth";

import Container from '../components/Container';

export default function Home() {

  const { user } = useAuth();

  async function signOut() {
    await firebase.auth().signOut();
  }

  return (
    <Container>
      <h1 className="welcome">Welcome to Budjet</h1>
      <p>A simple and user-friendly budget planner, to get u an overview about your spending and wishes</p>
      {!user && (
        <div className="text-center">
          <p>Looks like you&apos;re not logged in, create or login to your account here!</p>
          <div className="row">
            <Link href="/login">
              <a>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Login</motion.button>
              </a>
            </Link>
            <Link href="/register">
              <a>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Register</motion.button>
              </a>
            </Link>
          </div>
        </div>
      )}
      {user && (
        <div className="text-center">
          <p>Looks like you&apos;re logged in, wanna sign out or go to the overview?</p>
          <div className="row center">
            <Link href="/overview">
              <a>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Overview</motion.button>
              </a>
            </Link>
            <motion.button onClick={signOut} className="red" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Logout</motion.button>
          </div>
        </div>
      )}
    </Container>
  )
}
