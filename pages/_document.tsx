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

        <Script
          src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
          type="text/javascript"
        ></Script>
        <Script type="text/javascript" id="">
          {`WebFont.load({  'google': {    'families': ["Noto Sans:100,200,300,regular,500,600,700,800,900"]  }});`}
        </Script>
        <link rel="icon" href="/assets/image/email-editor-icon.png" />
        {/* <Script
          key={"0"}
          id={"0"}
          strategy="beforeInteractive"
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6684599c709edcc788d9219e"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        /> */}
        {/* <Script
          key={"2"}
          src="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/js/splide.min.js"
         
        ></Script> */}

        
      </Head>
      <body>
        <Main />
        
        <NextScript />

        
      </body>
    </Html>
  );
}
