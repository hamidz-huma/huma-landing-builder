import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,800&family=Signika+Negative:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></Script>
        <Script type="text/javascript" id="">
        {`WebFont.load({  'google': {    'families': ["Noto Sans:100,200,300,regular,500,600,700,800,900"]  }});`}
        </Script>
        <link rel="icon" href="/assets/image/email-editor-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}