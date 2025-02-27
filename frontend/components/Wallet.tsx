import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";

export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      dispatch({ type: "connect", wallet: accounts[0], balance });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

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

  const overlayVisible = !isConnected;

  return overlayVisible ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            <span className="block">Sign into Aetheris</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-black">
            Your Decentralized Governance AI Advisor
          </p>

          {wallet && balance && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
              <p className="text-lg font-semibold mb-2 text-black">Address:</p>
              <p className="text-lg font-mono mb-4 truncate border border-gray-300 p-2 rounded text-black">{wallet}</p>
              <p className="text-lg font-semibold mb-2 text-black">Balance:</p>
              <p className="text-lg font-mono mb-4 border border-gray-300 p-2 rounded text-black">{balance}</p>
            </div>
          )}

          {showConnectButton && (
            <button
              onClick={handleConnect}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-blue-500 text-black px-5 py-3 text-base font-medium hover:bg-blue-500 hover:text-white transition"
            >
              {status === "loading" ? <Loading /> : "Connect Wallet"}
            </button>
          )}

          {showInstallMetamask && (
            <Link
              href="https://metamask.io/"
              target="_blank"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-blue-500 text-black px-5 py-3 text-base font-medium hover:bg-blue-500 hover:text-white transition"
            >
              Install Metamask
            </Link>
          )}

          {isConnected && (
            <div className="flex justify-center space-x-2 mt-6">
              <button
                onClick={handleAddUsdc}
                className="inline-flex items-center justify-center rounded-full border border-blue-500 text-black px-5 py-3 text-base font-medium hover:bg-blue-500 hover:text-white transition"
              >
                {status === "loading" ? <Loading /> : "Add Token"}
              </button>
              <button
                onClick={handleDisconnect}
                className="inline-flex items-center justify-center rounded-full border border-red-500 text-black px-5 py-3 text-base font-medium hover:bg-red-500 hover:text-white transition"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
