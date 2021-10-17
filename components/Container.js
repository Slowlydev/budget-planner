import { useRouter } from "next/router";
import { useEffect } from "react";

import Header from "./Header";
import Navbar from "./Navbar";

export default function Container(props) {

	const router = useRouter();

	useEffect(() => {
		router.prefetch("/");
		router.prefetch("/overview");
	});

	return (
		<div>
			<Header />
			{props.navbar && (
				<Navbar />
			)}
			<div className="container">
				{props.children}
			</div>
		</div>
	)
}