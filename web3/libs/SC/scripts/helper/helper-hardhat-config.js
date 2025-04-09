const { ethers } = require("hardhat");
const { int } = require("hardhat/internal/core/params/argumentTypes");
const networkConfig = {
  31337: {
    name: "localhost",
    blockConfirmations: 1,
    entranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH,
    keyHash: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    subscriptionId: "0",
    callbackGasLimit: "500000",
    interval: "30",

  },
  11155111: {
    name: "sepolia",
    blockConfirmations: 6,
    vrfCoordinatorV2_5: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    entranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    keyHash: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    subscriptionId: "0",
    callbackGasLimit: "500000",
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