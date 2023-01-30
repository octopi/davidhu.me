import type { NextPage } from "next";
import Head from "next/head";
import Terminal from "./terminal";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col flex-1 items-center justify-center bg-slate-100 py-2">
      <Head>
        <title>davidhu.me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-bold text-slate-500">
          Hi! I'm David and I like to help people build things.
        </h1>

        <h2 className="my-4 text-lg text-slate-500">
          I have 8+ years of experience building developer products and
          educating people about them. Learn more by trying my API below!
        </h2>

        {/* <div className="w-20">
          <video autoPlay controls loop muted>
            <source src="/test.mov" type="video/mp4" />
          </video>
        </div> */}
        <div className="mt-4">
          <p className="bg-slate-100 text-sm text-slate-500 md:hidden mb-4">
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
