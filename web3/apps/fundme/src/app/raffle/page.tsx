'use client';
import { useState } from "react";
import { MoralisProvider } from "react-moralis";
import Header from "./header";
// import { MoralisProviderWrapper } from "@web3/moraliswrapper"
function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  return (
    <MoralisProvider initializeOnMount={false} >
      <div>
        <title>Raffle</title>
        <Header />
        {/* Your app components go here */}
      </div>
    </MoralisProvider>
  );
}

export default App;

