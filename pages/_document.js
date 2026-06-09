import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-TW">
      <Head>
        <meta name="description" content="PawGuide — 全台最完整的狗狗友善住宿平台，帶著毛孩一起旅行" />
        <meta property="og:site_name" content="PawGuide" />
        <meta property="og:description" content="全台最完整的狗狗友善住宿平台" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
