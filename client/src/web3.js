import { ethers } from 'ethers';

// Import ABIs from artifacts
import LandRegistryArtifact from './artifacts/LandRegistry.json';
import LandNFTArtifact from './artifacts/LandNFT.json';
import MarketplaceArtifact from './artifacts/Marketplace.json';
import EscrowArtifact from './artifacts/Escrow.json';

// Load deployed contract addresses from Vite environment variables (with fallbacks)
export const LAND_REGISTRY_ADDRESS = import.meta.env.VITE_LAND_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000';
export const LAND_NFT_ADDRESS = import.meta.env.VITE_LAND_NFT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x0000000000000000000000000000000000000000';
export const ESCROW_ADDRESS = import.meta.env.VITE_ESCROW_ADDRESS || '0x0000000000000000000000000000000000000000';

/**
 * Check if MetaMask is installed in the browser.
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Connect the user's MetaMask wallet and return the signer and address.
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
  }

  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Instantiate Ethers Web3Provider and get Signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};

/**
 * Get the current connected wallet signer and address (without prompting if already connected).
 */
export const getConnectedWallet = async () => {
  if (!isMetaMaskInstalled()) return null;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.listAccounts();
  
  if (accounts.length === 0) return null;

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};

/**
 * Instantiate the LandRegistry contract instance.
 */
export const getLandRegistryContract = (signerOrProvider) => {
  return new ethers.Contract(LAND_REGISTRY_ADDRESS, LandRegistryArtifact.abi, signerOrProvider);
};

/**
 * Instantiate the LandNFT contract instance.
 */
export const getLandNFTContract = (signerOrProvider) => {
  return new ethers.Contract(LAND_NFT_ADDRESS, LandNFTArtifact.abi, signerOrProvider);
};

/**
 * Instantiate the Marketplace contract instance.
 */
export const getMarketplaceContract = (signerOrProvider) => {
  return new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceArtifact.abi, signerOrProvider);
};

/**
 * Instantiate the Escrow contract instance.
 */
export const getEscrowContract = (signerOrProvider) => {
  return new ethers.Contract(ESCROW_ADDRESS, EscrowArtifact.abi, signerOrProvider);
};

/**
 * Listen for account or network changes in the browser wallet.
 */
export const subscribeToWalletEvents = (onAccountsChanged, onChainChanged) => {
  if (!isMetaMaskInstalled()) return;

  if (onAccountsChanged) {
    window.ethereum.on('accountsChanged', onAccountsChanged);
  }
  if (onChainChanged) {
    window.ethereum.on('chainChanged', onChainChanged);
  }
};

/**
 * Prompts the user to sign a dynamic nonce message using MetaMask to securely verify ownership.
 * Prevents anyone from claiming another person's wallet address.
 */
export const verifyWalletOwnership = async (signer, address) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const challengeMessage = `Welcome to LandVerse!\n\nClick "Sign" to securely link this wallet to your account. This signature proves that you own this private key.\n\nSecurity Nonce: ${nonce}`;

  const signature = await signer.signMessage(challengeMessage);
  const recoveredAddress = ethers.verifyMessage(challengeMessage, signature);

  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Signature verification failed: Recovered address does not match claimed address.');
  }

  return { verified: true, nonce, signature };
};
