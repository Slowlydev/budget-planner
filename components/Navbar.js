import Link from "next/link";

export default function Nacbar(props) {
  return (
    <nav>
			<Link href="/whishlist">
				<div className="nav-item">
					<p>Whishlist</p>
				</div>
			</Link>
			<Link href="/bugetlist">
				<div className="nav-item">
					<p>Budgetlist</p>
				</div>
			</Link>
    </nav>
  )
}