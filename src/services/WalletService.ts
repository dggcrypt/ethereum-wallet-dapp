import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { IWallet } from '../types';

export class WalletService {
  private static readonly WALLET_KEY = 'encrypted_wallet';
  
  public static async createWallet(): Promise<IWallet> {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
  }

  public static encryptWallet(wallet: IWallet, password: string): string {
    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      wallet.privateKey,
      password
    ).toString();
    return encryptedPrivateKey;
  }

  public static decryptWallet(encryptedPrivateKey: string, password: string): IWallet {
    try {
      const decryptedPrivateKey = CryptoJS.AES.decrypt(
        encryptedPrivateKey,
        password
      ).toString(CryptoJS.enc.Utf8);
      return new ethers.Wallet(decryptedPrivateKey);
    } catch (error) {
      throw new Error('Invalid password');
    }
  }

  public static saveWalletToStorage(encryptedWallet: string): void {
    localStorage.setItem(this.WALLET_KEY, encryptedWallet);
  }

  public static getWalletFromStorage(): string | null {
    return localStorage.getItem(this.WALLET_KEY);
  }

  public static async signMessage(wallet: IWallet, message: string): Promise<string> {
    return await wallet.signMessage(message);
  }

  public static async verifySignature(
    message: string,
    signature: string,
    address: string
  ): Promise<boolean> {
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    return signerAddress.toLowerCase() === address.toLowerCase();
  }
}
