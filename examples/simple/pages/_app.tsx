import { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.0.0/themes/algolia-min.css"
      />
      <link rel="stylesheet" href="instantsearch.css" />
    </Head>
    <Component {...pageProps} />
  </>
);

export default App;
