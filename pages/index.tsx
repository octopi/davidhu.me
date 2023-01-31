import type { NextPage } from "next";
import Head from "next/head";
import Terminal from "./terminal";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-slate-100 py-2">
      <Head>
        <title>davidhu.me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-96 flex-1 flex-col items-center justify-center p-12 md:w-[620px]">
        <div className="flex">
          <img src="/profile.png" className="inline w-10 h-10 mr-2" />
          <div>
            <h1 className="text-4xl font-bold text-slate-500">
              Hi! I'm David.
            </h1>

            <h2 className="my-4 text-lg text-slate-500">
              I have 8+ years of experience building developer products and
              helping people build with them. Learn more by trying my API below!
            </h2>
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-4 bg-slate-100 text-sm text-slate-500 md:hidden">
            📱 Mobile? No need to type; just tap everything in{" "}
            <span className="italic">italics</span>.
          </p>
          <Terminal />
        </div>
      </main>
    </div>
  );
};

export default Home;
