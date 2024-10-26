import React, { useState, FormEvent } from 'react';
import { WalletService } from '../../services/WalletService';
import { toast } from 'react-toastify';
import { IWallet } from '../../types';

interface CreateWalletProps {
  onWalletCreated: (wallet: IWallet) => void;
}

const CreateWallet: React.FC<CreateWalletProps> = ({ onWalletCreated }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateWallet = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const wallet = await WalletService.createWallet();
      const encryptedWallet = WalletService.encryptWallet(wallet, password);
      WalletService.saveWalletToStorage(encryptedWallet);

      toast.success('Wallet created successfully!');
      onWalletCreated(wallet);
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
      <h2 className="text-2xl font-bold mb-6">Create New Wallet</h2>
      <form onSubmit={handleCreateWallet}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
            minLength={8}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Creating...' : 'Create Wallet'}
        </button>
      </form>
    </div>
  );
};

export default CreateWallet;
