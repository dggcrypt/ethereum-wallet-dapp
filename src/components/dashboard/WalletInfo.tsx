import React from 'react';
import { ethers } from 'ethers';

interface WalletInfoProps {
  address: string;
  balance: ethers.BigNumber;
  ensName: string | null;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ address, balance, ensName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Address:</span>{' '}
          {ensName ? `${ensName} (${address})` : address}
        </p>
        <p>
          <span className="font-medium">Balance:</span>{' '}
          {ethers.utils.formatEther(balance)} ETH
        </p>
      </div>
    </div>
  );
};

export default WalletInfo;
