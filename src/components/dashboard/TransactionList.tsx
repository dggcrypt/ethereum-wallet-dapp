import React from 'react';
import { ethers } from 'ethers';
import { ITransaction } from '../../types';

interface TransactionListProps {
  transactions: ITransaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {tx.to === tx.from ? 'Self Transfer' : 'Transfer'}
                </p>
                <p className="text-sm text-gray-600">To: {tx.to}</p>
                <p className="text-sm text-gray-600">
                  Amount: {ethers.utils.formatEther(tx.value)} ETH
                </p>
              </div>
              
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
