const { ethers } = require("hardhat");
import dotenv from "dotenv";
const networkConfig = {
  31337: {
    name: "localhost",
    blockConfirmations: 1,
    entranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH,
    keyHash: process.env.KEY_HASH,
    subscriptionId: process.env.SUBID,
    callbackGasLimit: process.env.CALLBACK_LIMIT,
    interval: "30",


  },
  11155111: {
    name: "sepolia",
    blockConfirmations: 6,
    vrfCoordinatorV2_5: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    entranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    keyHash: process.env.KEY_HASH,
    subscriptionId: "0",
    callbackGasLimit: process.env.CALLBACK_LIMIT,
    interval: "30",

  },
  5: {
    name: "goerli",
    blockConfirmations: 6,
  },

}
const developmentChains = ["hardhat", "localhost"];
module.exports = {
  networkConfig,
  developmentChains,
};