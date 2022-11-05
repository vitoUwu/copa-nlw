import '../styles/global.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    <Head>
      <title>Bolão da Copa</title>
    </Head>
    <Component {...pageProps} />
  </>
  )
}
