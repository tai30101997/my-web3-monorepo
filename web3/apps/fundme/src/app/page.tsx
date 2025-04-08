'use client';
import { ethers, formatEther, parseEther } from "ethers";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

const abi = [
  {
    "inputs": [{ "internalType": "address", "name": "priceFeed", "type": "address" }],
    "stateMutability": "nonpayable", "type": "constructor"
  },
  { "inputs": [], "name": "fund", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];
const ADDRESS_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export default function FundMeApp() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask detected!");
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      getBalance();
    } catch (error) {
      console.log("User denied account access:", error);
    }
  };

  const fundMe = async (ethAmount: number) => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ADDRESS_CONTRACT, abi, signer);
      const transactionRes = await contract.fund({ value: parseEther(ethAmount.toString()) });
      try {
        const receipt = await transactionRes.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
      getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
    setLoading(false);
  };

  const withdrawal = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ADDRESS_CONTRACT, abi, signer);
      const withdrawRes = await contract.withdraw();
      await withdrawRes.wait(3);
      getBalance();
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
    setLoading(false);
  };

  const getBalance = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(ADDRESS_CONTRACT);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f7', color: '#1d1d1f', padding: '20px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '600', marginBottom: '20px' }}>FundMe DApp</h1>
      {account ? (
        <>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Connected: <strong>{account}</strong></p>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>Contract Balance: <strong>{balance} ETH</strong></p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => fundMe(4.1)} disabled={loading} style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '500', borderRadius: '12px', backgroundColor: '#0071e3', color: 'white', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}>
              {loading ? "Processing..." : "Fund 4.1 ETH"}
            </button>
            <button onClick={getBalance} style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '500', borderRadius: '12px', backgroundColor: '#86868b', color: 'white', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}>
              Refresh Balance
            </button>
            <button onClick={withdrawal} disabled={loading} style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '500', borderRadius: '12px', backgroundColor: '#ff3b30', color: 'white', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}>
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </>
      ) : (
        <button onClick={connectWallet} style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '500', borderRadius: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
