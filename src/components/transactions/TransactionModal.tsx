import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { ethers } from 'ethers';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (gasPrice: ethers.BigNumber) => Promise<void>;
  estimatedGas: ethers.BigNumber;
}

type GasPriceOption = 'slow' | 'medium' | 'fast';

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  estimatedGas,
}) => {
  const [gasPrice, setGasPrice] = useState<GasPriceOption>('medium');
  
  const gasPrices: Record<GasPriceOption, ethers.BigNumber> = {
    slow: estimatedGas.mul(80).div(100),
    medium: estimatedGas,
    fast: estimatedGas.mul(120).div(100),
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-xl font-bold mb-4">
              Confirm Transaction
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Gas Price</label>
                <select
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value as GasPriceOption)}
                  className="w-full p-2 border rounded"
                >
                  <option value="slow">Slow (80% of base fee)</option>
                  <option value="medium">Medium (base fee)</option>
                  <option value="fast">Fast (120% of base fee)</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  Estimated Gas: {ethers.utils.formatUnits(gasPrices[gasPrice], 'gwei')} GWEI
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(gasPrices[gasPrice])}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionModal;
