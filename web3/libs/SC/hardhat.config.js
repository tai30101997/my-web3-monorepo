/** @type import('hardhat/config').HardhatUserConfig */
// require('@nomicfoundation/hardhat-toolbox');
// require('@nomicfoundation/hardhat-verify');
// require('dotenv').config();
// require('./tasks/block-number');
// require('hardhat-gas-reporter');
require("@nomicfoundation/hardhat-ignition");

require("solidity-coverage");
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""


module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
    keeper: {
      default: 2,
    },
  },
  mocha: {
    timeout: 200000,
  },
  paths: {
    sources: "./src/contracts",
  },
};
