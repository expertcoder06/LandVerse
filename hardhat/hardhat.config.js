import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env relative to this config file
dotenv.config({ path: resolve(__dirname, ".env") });

// Environment variables loaded from .env
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers],
  // Solidity compiler configuration
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      evmVersion: "cancun",
    },
  },

  // Networks configuration
  networks: {
    // Sepolia Testnet
    sepolia: {
      type: "http",
      url: SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/placeholder",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },

  // Etherscan smart contract verification configuration
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
});