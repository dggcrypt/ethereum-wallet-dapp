import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ITransaction } from '../types';

interface UseEthereumReturn {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  getBalance: (address: string) => Promise<ethers.BigNumber>;
  getTransactions: (address: string) => Promise<ITransaction[]>;
}

export const useEthereum = (): UseEthereumReturn => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  const connect = async (): Promise<void> => {
    if (!provider) throw new Error('No provider available');

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    setSigner(signer);
    setIsConnected(true);
  };

  const getBalance = async (address: string): Promise<ethers.BigNumber> => {
    if (!provider) throw new Error('No provider available');
    return await provider.getBalance(address);
  };

  const getTransactions = async (address: string): Promise<ITransaction[]> => {
    if (!provider) throw new Error('No provider available');

    const blockNumber = await provider.getBlockNumber();
    const blocks = await Promise.all(
      Array.from({ length: 10 }, (_, i) => 
        provider.getBlock(blockNumber - i, true)
      )
    );

    return blocks
      .flatMap(block => block.transactions)
      .filter(tx => 
        tx.from.toLowerCase() === address.toLowerCase() ||
        tx.to?.toLowerCase() === address.toLowerCase()
      )
      .slice(0, 10);
  };

  return {
    provider,
    signer,
    isConnected,
    connect,
    getBalance,
    getTransactions,
  };
};

export default useEthereum;
