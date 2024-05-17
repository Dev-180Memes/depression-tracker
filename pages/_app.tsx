import "@/styles/globals.css";
import type { AppProps } from "next/app";
import PrelineScript from "@/components/PrelineScript";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <PrelineScript />
    </>
  );
}
