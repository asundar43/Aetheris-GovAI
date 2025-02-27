import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Wallet from "../components/Wallet";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";

const Home: NextPage = () => {
  const { dispatch } = useMetamask();
  const listen = useListen();

  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explicit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet: storedWallet, balance: storedBalance } = local
        ? JSON.parse(local)
        : { wallet: null, balance: null };

      setWallet(storedWallet);
      setBalance(storedBalance);

      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet: storedWallet, balance: storedBalance });

      // If MetaMask is installed, request wallet connection
      if (isMetamaskInstalled && !storedWallet) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((accounts) => {
            const walletAddress = accounts[0];
            setWallet(walletAddress);
            // Save wallet address in local storage and update context
            window.localStorage.setItem(
              "metamaskState",
              JSON.stringify({ wallet: walletAddress, balance: "" })
            );
            dispatch({ type: "connect", wallet: walletAddress, balance: "" });
          })
          .catch((error) => {
            console.error("Failed to connect wallet:", error);
          });
      }
    }
  }, []);

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const handleAddUsdc = async () => {
    dispatch({ type: "loading" });

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          symbol: "USDC",
          decimals: 18,
          image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
        },
      },
    });
    dispatch({ type: "idle" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Welcome to Aetheris</h1>
      </header>
      <main className="flex flex-col items-center">
        <Wallet />
        <div className="text-center mt-8">
          {wallet && (
            <div className="mt-4 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 text-left">
              <p className="text-lg font-semibold mb-2">Connected Wallet:</p>
              <p className="text-lg font-mono mb-4 truncate border border-gray-600 p-2 rounded">{wallet}</p>
              <p className="text-lg font-semibold mb-2">Balance:</p>
              <p className="text-lg font-mono mb-4 border border-gray-600 p-2 rounded">{balance || 'Loading...'}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleAddUsdc}
                  className="inline-flex items-center justify-center rounded-full border border-blue-500 text-white px-5 py-3 text-base font-medium hover:bg-blue-500 hover:text-black transition"
                >
                  Add Token
                </button>
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center justify-center rounded-full border border-red-500 text-white px-5 py-3 text-base font-medium hover:bg-red-500 hover:text-black transition"
                >
                  Disconnect
                </button>
                <button
                  onClick={() => window.location.href = '/analyze-proposal'}
                  className="inline-flex items-center justify-center rounded-full border border-green-500 text-white px-5 py-3 text-base font-medium hover:bg-green-500 hover:text-black transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="mt-8">
        <p className="text-sm">© 2025 Aadhav Sundar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
