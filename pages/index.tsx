import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/Main";

export default function Home() {
  return (
    <div className="flex flex-col justify-between w-screen h-screen max-h-screen min-h-screen select-none text-slate-50">
      <Header />
      <Main />
      {/* <TransactionHistory /> */}
    </div>
  );
}
