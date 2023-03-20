import Head from "next/head";

export default function Header(props) {
	return (
		<Head>
			<meta charSet="UTF-8" key="charset" />
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />

			<title>Budjet</title>

			<meta name="description" content="Plann your montly budget"></meta>

			<meta name="apple-mobile-web-app-title" content="Budjet" key="apple-title" />

			<meta name="robots" content="index, follow" />

			<meta property="og:title" content="Budjet" />
			<meta property="og:site_name" content="Budjet" />
			<meta property="og:description" content="Plan your montly budget" />
			<meta property="og:image" content="/logo.png" />
			<meta property="og:url" content="https://budjet.vercel.app/" />
			<meta property="og:type" content="website" />

			<meta name="twitter:title" content="Budjet" />
			<meta name="twitter:description" content="Plan your montly budget" />
			<meta name="twitter:image" content="/logo.png" />

			<meta name="theme-color" content="#027fff" key="theme-color" />
			<meta name="apple-mobile-web-app-capable" content="yes" key="apple-web-app-capable" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" key="apple-status-bar" />

			<link rel="shortcut icon" type="image/x-icon" href="/logo.png" key="shurtcut-icon" />
			<link rel="apple-touch-icon" href="/logo.png" key="apple-touch-icon" />

			<link rel="canonical" href="https://budjet.vercel.app"></link>

			<link rel="manifest" href="/manifest.webmanifest" />

			<meta name="google-site-verification" content="YrJQ8TKThpSU_S4q2WNj7XD56MUXpg3Jkdc5csmrXl0" />

			<script async defer data-website-id="dd327634-2225-4265-95b0-ebabc46137b6" src="https://slowly-base.vercel.app/rep.js" />
		</Head>
	)
}