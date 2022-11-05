import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
      </Head>
      <body className='bg-gray-900 scroll-smooth'>
        <div className='h-72 w-72 absolute left-0 top-0 bg-ignite-500/50 blur-3xl -z-10 rounded-full'></div>
        <div className='h-96 w-96 absolute right-10 top-1/2 bg-yellow-500/50 blur-3xl -z-10 rounded-full'></div>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  )
}