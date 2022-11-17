import { createContext, useContext, useEffect, useState } from "react";

const TransactionContext = createContext();

const useGlobalTransactionContext = () => useContext(TransactionContext);

let metaMask;

if (typeof window !== "undefined") {
  metaMask = window.ethereum;
}

const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ addressTo: "", amount: "" });

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

      // await saveTransaction(
      //   txReceipt.hash,
      //   amount,
      //   connectedAccount,
      //   addressTo
      // );

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

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { useGlobalTransactionContext, TransactionProvider };
