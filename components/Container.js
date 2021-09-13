import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useEffect } from "react";

import Header from "./Header";
import Navbar from "./Navbar";

export default function Container(props) {

	const router = useRouter();

	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/account");
	});

	return (
		<div className="container">
			<Header />
			<Navbar />
      {props.children}
		</div>
	)
}