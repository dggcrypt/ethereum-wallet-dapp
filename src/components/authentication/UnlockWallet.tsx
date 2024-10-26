import React, { useState, FormEvent } from 'react';
import { WalletService } from '../../services/WalletService';
import { toast } from 'react-toastify';
import { IWallet } from '../../types';

interface UnlockWalletProps {
  onWalletUnlocked: (wallet: IWallet) => void;
}

const UnlockWallet: React.FC<UnlockWalletProps> = ({ onWalletUnlocked }) => {
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const encryptedWallet = WalletService.getWalletFromStorage();
      
      if (!encryptedWallet) {
        throw new Error('No wallet found');
      }

      const wallet = WalletService.decryptWallet(encryptedWallet, password);
      toast.success('Wallet unlocked successfully!');
      onWalletUnlocked(wallet);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Unlock Wallet</h2>
      <form onSubmit={handleUnlock}>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Unlocking...' : 'Unlock Wallet'}
        </button>
      </form>
    </div>
  );
};

export default UnlockWallet;
