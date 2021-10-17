import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Navbar(props) {

	const router = useRouter();

	return (
		<nav>
			<Link href="/wishlist">
				<a>
					<motion.button className={`nav-item ${router.asPath === "/wishlist" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>Wishlist</motion.button>
				</a>
			</Link>
			<Link href="/overview">
				<a>
					<motion.button className={`nav-item ${router.asPath === "/overview" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>Overview</motion.button>
				</a>
			</Link>
			<Link href="/budgetlist">
				<a>
					<motion.button className={`nav-item ${router.asPath === "/budgetlist" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>Budgetlist</motion.button>
				</a>
			</Link>
		</nav>
	)
}