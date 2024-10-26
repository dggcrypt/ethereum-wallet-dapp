import { ethers } from 'ethers';
import { ITokenDetails, INFTCollection } from '../types';

export class TokenService {
  private provider: ethers.providers.Web3Provider;

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
  }

  private getContract(address: string, abi: ethers.ContractInterface): ethers.Contract {
    return new ethers.Contract(address, abi, this.provider);
  }

  public async getTokenDetails(address: string): Promise<ITokenDetails> {
    const contract = this.getContract(address, [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function balanceOf(address) view returns (uint)'
    ]);

    const [name, symbol, decimals, balance] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(this.provider.getSigner().getAddress())
    ]);

    return {
      address,
      name,
      symbol,
      decimals,
      balance: ethers.utils.formatUnits(balance, decimals)
    };
  }

  public async getNFTCollection(address: string): Promise<INFTCollection> {
    const contract = this.getContract(address, [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function balanceOf(address) view returns (uint)',
      'function tokenOfOwnerByIndex(address, uint) view returns (uint)',
      'function tokenURI(uint) view returns (string)'
    ]);

    const [name, symbol] = await Promise.all([
      contract.name(),
      contract.symbol()
    ]);

    const balance = await contract.balanceOf(this.provider.getSigner().getAddress());
    const tokens: INFTToken[] = [];

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(
        this.provider.getSigner().getAddress(),
        i
      );
      const tokenURI = await contract.tokenURI(tokenId);
      tokens.push({ tokenId: tokenId.toString(), tokenURI });
    }

    return {
      address,
      name,
      symbol,
      tokens
    };
  }
}
