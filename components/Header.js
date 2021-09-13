import Head from "next/head";

export default function Header(props) {
	return (
		<Head>
			<meta charSet="UTF-8" key="charset" />
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />

			<title>Budget Planner</title>

			<meta name="description" content="Plann your montly budget"></meta>

			<meta name="apple-mobile-web-app-title" content="Budget Planner" key="apple-title" />

			<meta name="robots" content="index, follow" />

			<meta property="og:title" content="Budget Planner" />
			<meta property="og:site_name" content="Budget Planner" />
			<meta property="og:description" content="Plann your montly budget" />
			<meta property="og:image" content="/logo_nobg.png" />
			<meta property="og:url" content="https://budget-planner.vercel.app/" />
			<meta property="og:type" content="website" />

			<meta name="twitter:title" content="Budget Planner" />
			<meta name="twitter:description" content="Plann your montly budget" />
			<meta name="twitter:image" content="/logo_nobg.png" />

			<meta name="theme-color" content="#027fff" key="theme-color" />
			<meta name="apple-mobile-web-app-capable" content="yes" key="apple-web-app-capable" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" key="apple-status-bar" />

			<link rel="shortcut icon" type="image/x-icon" href="/logo_nobg.png" key="shurtcut-icon" />
			<link rel="apple-touch-icon" href="/logo.png" key="apple-touch-icon" />

			<link rel="canonical" href="https://budget-planner.vercel.app"></link>
		</Head>
	)
}