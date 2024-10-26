import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateWallet from './components/authentication/CreateWallet';
import UnlockWallet from './components/authentication/UnlockWallet';
import WalletInfo from './components/dashboard/WalletInfo';
import TransactionList from './components/dashboard/TransactionList';
import TransactionModal from './components/transactions/TransactionModal';
import { WalletService } from './services/WalletService';
import { TokenService } from './services/TokenService';
import useEthereum from './hooks/useEthereum';
import { IWallet, ITransaction, ITokenDetails, INFTCollection } from './types';

interface PendingTransaction {
  to: string;
  value: ethers.BigNumber;
}

const App: React.FC = () => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [tokens, setTokens] = useState<ITokenDetails[]>([]);
  const [nftCollections, setNftCollections] = useState<INFTCollection[]>([]);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<ethers.BigNumber | null>(null);

  const {
    provider,
    signer,
    isConnected,
    connect,
    getBalance,
    getTransactions
  } = useEthereum();

  useEffect(() => {
    if (wallet && provider) {
      fetchWalletData();
    }
  }, [wallet, provider]);

  const fetchWalletData = async (): Promise<void> => {
    if (!wallet || !provider) return;

    try {
      // Get balance
      const balance = await getBalance(wallet.address);
      setBalance(balance);

      // Try to get ENS name
      const ensName = await provider.lookupAddress(wallet.address);
      if (ensName) {
        setEnsName(ensName);
      }

      // Get recent transactions
      const transactions = await getTransactions(wallet.address);
      setTransactions(transactions);

      // Initialize TokenService
      const tokenService = new TokenService(provider);

      // Example token addresses (replace with actual token addresses)
      const tokenAddresses = [
        '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
        '0x6b175474e89094c44da98b954eedeac495271d0f'  // DAI
      ];

      const tokenPromises = tokenAddresses.map(address => 
        tokenService.getTokenDetails(address)
      );
      const tokens = await Promise.all(tokenPromises);
      setTokens(tokens);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error fetching wallet data');
      }
    }
  };

  const handleSendTransaction = async (
    to: string,
    amount: string
  ): Promise<void> => {
    if (!provider) {
      toast.error('No provider available');
      return;
    }

    try {
      const parsedAmount = ethers.utils.parseEther(amount);
      
      // Estimate gas
      const gasEstimate = await provider.estimateGas({
        to,
        value: parsedAmount
      });
      
      setEstimatedGas(gasEstimate);
      setPendingTransaction({ to, value: parsedAmount });
      setTransactionModalOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error preparing transaction');
      }
    }
  };

  const handleConfirmTransaction = async (
    gasPrice: ethers.BigNumber
  ): Promise<void> => {
    if (!signer || !pendingTransaction) return;

    try {
      const tx = await signer.sendTransaction({
        ...pendingTransaction,
        gasPrice
      });

      toast.info('Transaction submitted');
      await tx.wait();
      toast.success('Transaction confirmed');
      
      fetchWalletData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Transaction failed');
      }
    } finally {
      setTransactionModalOpen(false);
      setPendingTransaction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" />
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">Ethereum Wallet</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!wallet ? (
          <div className="grid gap-8 md:grid-cols-2">
            <CreateWallet onWalletCreated={setWallet} />
            <UnlockWallet onWalletUnlocked={setWallet} />
          </div>
        ) : (
          <div className="space-y-6">
            <WalletInfo
              address={wallet.address}
              balance={balance}
              ensName={ensName}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Send ETH</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const to = formData.get('recipient') as string;
                    const amount = formData.get('amount') as string;
                    handleSendTransaction(to, amount);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2">Recipient</label>
                    <input
                      name="recipient"
                      type="text"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Amount (ETH)</label>
                    <input
                      name="amount"
                      type="number"
                      step="0.0001"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Send
                  </button>
                </form>
              </div>

              <TransactionList transactions={transactions} />
            </div>
          </div>
        )}
      </main>

      {estimatedGas && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setTransactionModalOpen(false)}
          onConfirm={handleConfirmTransaction}
          estimatedGas={estimatedGas}
        />
      )}
    </div>
  );
};

export default App;
