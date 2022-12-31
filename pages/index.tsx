import type { NextPage } from "next";
import Head from "next/head";
import Terminal from "./terminal";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black py-2">
      <Head>
        <title>davidhu.me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <h1 className="text-6xl font-bold text-slate-500">
            Hi, my name is{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            David
          </a>
        </h1>

        <div className="w-20">
          <video autoPlay controls loop muted>
            <source src="/test.mov" type="video/mp4" />
          </video>
        </div>
        <Terminal />
      </main>
    </div>
  );
};

export default Home;
