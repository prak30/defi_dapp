'use client';
import React, { useState } from 'react';
import CryptoList from '../Components/CryptoList';
import App from '../Components/App';

const Page: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [web3Provider, setWeb3Provider] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  return (
    <div>
      {!isWalletConnected ? (
        <App onWalletConnected={setIsWalletConnected} />
      ) : (
        <CryptoList web3Provider={web3Provider} selectedAddress={selectedAddress}/>
      )}
    </div>
  );
}

export default Page;
