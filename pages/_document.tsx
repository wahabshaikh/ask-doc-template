import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="A service to help companies make their knowledge base insightful"
          />
          <meta property="og:site_name" content="ask-doc-template.vercel.app" />
          <meta
            property="og:description"
            content="A service to help companies make their knowledge base insightful"
          />
          <meta property="og:title" content="AskDoc" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AskDoc" />
          <meta
            name="twitter:description"
            content="A service to help companies make their knowledge base insightful"
          />
          <meta
            property="og:image"
            content="https://ask-doc-template.vercel.app/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://ask-doc-template.vercel.app/og-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
