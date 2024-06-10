import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

const providerOptions = {};

function App() {
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });
      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider = new Web3Provider(web3ModalInstance);
  
      setWeb3Provider(web3ModalProvider);
  
      // Check if ethereum is available in window object
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setSelectedAddress(accounts ? accounts[0] : null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (web3Provider) {
      const provider = web3Provider.getSigner();

      const fetchAccounts = async () => {
        if (provider.provider?.send) {
          const accounts = await provider.provider.send('eth_accounts', []);
          setSelectedAddress(accounts ? accounts[0] : null);
        }
      };

      fetchAccounts();

      const handleAccountsChanged = (accounts: string[]) => {
        setSelectedAddress(accounts ? accounts[0] : null);
      };

      provider.provider?.on("accountsChanged", handleAccountsChanged);

      return () => {
        provider.provider?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [web3Provider]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web3Modal connection!!!</h1>
        {web3Provider == null ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <p>Connected</p>
            <p>Address: {selectedAddress}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
