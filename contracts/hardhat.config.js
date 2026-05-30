import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "dotenv/config";
import { defineConfig } from "hardhat/config";

// Environment variables loaded from .env
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export default defineConfig({
  // Solidity compiler configuration
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // Networks configuration
  networks: {
    // Sepolia Testnet
    sepolia: {
      type: "http",
      url: SEPOLIA_RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },

  // Etherscan smart contract verification configuration
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
});