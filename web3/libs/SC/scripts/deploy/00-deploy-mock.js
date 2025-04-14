const { developmentChains } = require("../helper/helper-hardhat-config");
const { network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;
  if (developmentChains.includes(chainId)) {
    const baseFee = ethers.utils.parseEther("0.1"); // 0.1 LINK per request
    const gasPrice = 1e9; // 1 Gwei
    const weiPerUnitLink = ethers.utils.parseUnits("1", "ether"); // Conversion rate
    log("Local network detected! Deploying mocks...");
    const VRFCoordinatorV2_5Mock = await deploy("VRFCoordinatorV2_5Mock", {
      from: deployer,
      args: [baseFee, gasPrice, weiPerUnitLink], // Pass the parameters here
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,

    });
    log(`VRFCoordinatorV2_5Mock deployed at ${VRFCoordinatorV2_5Mock.address}`);
    log("Mocks deployed!");
  }

}
module.exports.tags = ["all", "mocks"]