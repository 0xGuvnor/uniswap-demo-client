import React, { useEffect, useState } from "react";
import Image from "next/image";
import ethLogo from "../assets/ethCurrency.png";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { client } from "../lib/sanityClient";
import { useGlobalTransactionContext } from "../context/TransactionContext";

const style = {
  wrapper: `h-full text-white select-none h-full w-screen flex-1 pt-14 flex items-end justify-end pb-12 overflow-scroll px-8`,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-2 my-2 flex items-center justify-end`,
  txDetails: `flex items-center`,
  toAddress: `text-[#f48706] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-[#2172e5]`,
};

const TransactionHistory = () => {
  const { isLoading, currentAccount } = useGlobalTransactionContext();

  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    (async () => {
      if (!isLoading && currentAccount) {
        const query = `*[_type=="users" && _id=="${currentAccount}"] {
          "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
        }`;

        const clientRes = await client.fetch(query);

        setTransactionHistory(clientRes[0].transactionList);
      }
    })();
  }, [isLoading, currentAccount]);

  return (
    <div className="h-full select-none w-screen flex text-white flex-1 pt-14 items-end justify-end pb-12 overflow-scroll px-8">
      <div>
        {transactionHistory &&
          transactionHistory.map((transaction, index) => (
            <div
              className="bg-[#191a1e] rounded-lg px-4 py-2 my-2 flex items-center justify-end"
              key={index}
            >
              <div className="flex items-center">
                <Image
                  src={ethLogo}
                  height={20}
                  width={15}
                  alt="Eth logo"
                  className="mr-2"
                />
                {transaction.amount} Ξ sent to{" "}
                <span
                  className="text-[#f48706] mx-2 cursor-pointer flex items-center"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.toAddress);
                  }}
                >
                  {transaction.toAddress.slice(0, 5)}...
                  {transaction.toAddress.slice(-4)}
                  <HiOutlineClipboardDocument />
                </span>
              </div>{" "}
              on{" "}
              <div className="mx-2">
                {new Date(transaction.timestamp).toLocaleString("en-US", {
                  timeZone: "PST",
                  hour12: true,
                  timeStyle: "short",
                  dateStyle: "long",
                })}
              </div>
              <div className="text-[#2172e5]">
                <a
                  href={`https://testnet.bscscan.com/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  View on BSCscan <FiArrowUpRight />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
