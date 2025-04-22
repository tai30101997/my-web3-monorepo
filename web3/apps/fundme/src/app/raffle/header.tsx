import React, { useEffect } from 'react';

import { useMoralis } from "react-moralis";


const Header: React.FC = () => {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined" && window.localStorage.getItem('connected')) {
      enableWeb3()
    }
  }, [isWeb3Enabled]);


  return (
    <header style={{
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '16px',
    }}>
      {account ? <div>Connected to {account.slice(0, 6)} ... {account.slice(account.length - 4)}</div> : <>  <button
        onClick={async () => {
          await enableWeb3();
          if (typeof window !== "undefined") {
            window.localStorage.setItem('connected', 'inject')
          }
        }}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '12px',
          backgroundColor: '#86868b',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
      >
        Connect Wallet
      </button></>}

    </header>
  );
};

export default Header;