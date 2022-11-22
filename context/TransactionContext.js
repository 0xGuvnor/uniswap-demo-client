import { ethers } from "ethers";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { contractAddress, contractABI } from "../lib/constants";
import { client } from "../lib/sanityClient";

const TransactionContext = createContext();

const useGlobalTransactionContext = () => useContext(TransactionContext);

let metaMask;

if (typeof window !== "undefined") {
  metaMask = window.ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(metaMask);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ addressTo: "", amount: "" });

  const router = useRouter();

  const connectWallet = async () => {
    try {
      if (!metaMask) return alert("Please install MetaMask");

      const accounts = await metaMask.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum Object");
    }
  };

  const isConnected = async () => {
    try {
      if (!metaMask) return alert("Please install MetaMask");

      const accounts = await metaMask.request({ method: "eth_accounts" });

      if (accounts.length) setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const saveTransaction = async (txHash, amount, fromAddress, toAddress) => {
    const txDoc = {
      _type: "transactions",
      _id: txHash,
      fromAddress,
      toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash,
      amount: parseFloat(amount),
    };

    await client.createIfNotExists(txDoc);

    await client
      .patch(currentAccount)
      .setIfMissing({ transactions: [] })
      .insert("after", "transactions[-1]", [
        { _key: txHash, _ref: txHash, _type: "reference" },
      ])
      .commit();
  };

  const sendTransaction = async () => {
    try {
      if (!metaMask) return alert("Please install MetaMask");

      const { addressTo, amount } = formData;
      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      await metaMask.request({
        method: "eth_sendTransaction",
        params: [
          { from: currentAccount, to: addressTo, value: parsedAmount._hex },
        ],
      });

      const tx = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ${parsedAmount} ETH to ${addressTo}`,
        "TRANSFER"
      );

      setIsLoading(true);

      const txReceipt = await tx.wait();

      await saveTransaction(
        txReceipt.transactionHash,
        amount,
        currentAccount,
        addressTo
      );

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e, fieldName) => {
    setFormData((prevState) => ({ ...prevState, [fieldName]: e.target.value }));
  };

  useEffect(() => {
    isConnected();
  }, []);

  useEffect(() => {
    if (!currentAccount) return;

    (async () => {
      const userDoc = {
        _type: "users",
        _id: currentAccount,
        userName: "Unnamed",
        address: currentAccount,
      };

      await client.createIfNotExists(userDoc);
    })();
  }, [currentAccount]);

  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`);
    } else {
      router.push(`/`);
    }
  }, [isLoading]);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { useGlobalTransactionContext, TransactionProvider };
