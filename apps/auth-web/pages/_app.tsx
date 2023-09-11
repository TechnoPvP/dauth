import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import RootLayout from '../libs/layout/RootLayout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AirhubOne Login</title>
      </Head>

      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </>
  );
}

export default CustomApp;
