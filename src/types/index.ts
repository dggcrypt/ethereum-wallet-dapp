import { ethers } from 'ethers';

export interface IWallet {
  address: string;
  privateKey: string;
  signMessage(message: string): Promise<string>;
}

export interface ITransaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
  blockNumber: number;
  timestamp: number;
}

export interface ITokenDetails {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

export interface INFTToken {
  tokenId: string;
  tokenURI: string;
}

export interface INFTCollection {
  address: string;
  name: string;
  symbol: string;
  tokens: INFTToken[];
}
