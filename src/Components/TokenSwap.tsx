// Components/TokenSwap.tsx
'use client';

import React, { useState } from 'react';

let ethers = require('../../node_modules/ethers');

import { Web3Provider } from '@ethersproject/providers';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';

const providerOptions = {};

interface TokenSwapProps {
  web3Provider: any;
  selectedAddress: string;
}

const TokenSwap: React.FC<TokenSwapProps> = ({ web3Provider, selectedAddress }) => {
  const [fromToken, setFromToken] = useState<string>('DAI');
  const [toToken, setToToken] = useState<string>('WETH');
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [swapResult, setSwapResult] = useState<string | null>(null);

  // Replace ZeroEx initialization with appropriate code if needed
  // const zeroEx = new ZeroEx(web3Provider); 

  const handleSwap = async () => {
    const fromTokenAddress = getTokenAddress(fromToken);
    const toTokenAddress = getTokenAddress(toToken);

    const fromTokenContract = new ERC20TokenContract(fromTokenAddress, web3Provider.getSigner());
    const fromAmountWei = ethers.utils.parseUnits(fromAmount, 18);

    // Approve the 0x contract to spend the fromToken
    await fromTokenContract.approve('0xYourERC20ProxyAddress', new BigNumber(fromAmountWei.toString())).awaitTransactionSuccessAsync();

    // Fetch swap quote from 0x API
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${fromAmountWei.toString()}`
    );
    const quote = await response.json();

    // Send the swap transaction
    const tx = await web3Provider.getSigner().sendTransaction({
      to: quote.to,
      data: quote.data,
      value: quote.value
    });

    setSwapResult(`Transaction hash: ${tx.hash}`);
  };

  const getTokenAddress = (symbol: string) => {
    const tokenAddresses: { [key: string]: string } = {
      DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
      WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    };
    return tokenAddresses[symbol];
  };

  return (
    <div>
      <h2>Token Swap</h2>
      <div>
        <label>From Token:</label>
        <input value={fromToken} onChange={(e) => setFromToken(e.target.value)} />
      </div>
      <div>
        <label>To Token:</label>
        <input value={toToken} onChange={(e) => setToToken(e.target.value)} />
      </div>
      <div>
        <label>Amount:</label>
        <input value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} />
      </div>
      <button onClick={handleSwap}>Swap</button>
      {swapResult && <p>{swapResult}</p>}
    </div>
  );
};

export default TokenSwap;
