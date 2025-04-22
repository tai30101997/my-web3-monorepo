'use client';
import { ethers, formatEther } from "ethers";
import { useEffect, useState } from "react";
import { MoralisProviderWrapper } from "@web3/moralist-wrapper";
const ADDRESS_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const appId = "your-moralis-app-id";
const serverUrl = "your-moralis-server-url";
function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask detected!");
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const account = window.ethereum.request({ method: "eth_requestAccount" });
      setAccount(account[0]);
    } catch (error) {
      console.log(error)
    }
  }
  const getBalance = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(ADDRESS_CONTRACT);
    setBalance(formatEther(balance));

  }
  return (
    <MoralisProviderWrapper appId={appId} serverUrl={serverUrl}>
      <div>
        <h1>FundMe App</h1>
        {/* Your app components go here */}
      </div>
    // </MoralisProviderWrapper>
  );
}

export default App;