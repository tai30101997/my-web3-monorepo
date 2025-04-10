const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper/helper-hardhat-config");
const { verify } = require("../../utils/verify");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;
  let subId;
  const fundSubscription = ethers.utils.parseEther("30"); // 0.1 LINK per request
  let VRFCoordinatorV2_5Mock_address;
  // if only want to deploy mocks on local network and get address from config on testnet
  // if (developmentChains.includes(network.name)) {
  //   VRFCoordinatorV2_5Mock_address = (await deployments.get("VRFCoordinatorV2_5Mock")).address;
  // } else {
  //   VRFCoordinatorV2_5Mock_address = network.config.vrfCoordinatorV2_5;
  // }
  // log("----------------------------------------------------");

  // if only want to deploy mocks on local network and contact with function config on testnet

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    const VRFCoordinatorV2_5Mock = await ethers.getContract("VRFCoordinatorV2_5Mock");
    log(`VRFCoordinatorV2_5Mock deployed at ${VRFCoordinatorV2_5Mock.address}`);
    const tx = await VRFCoordinatorV2_5Mock.createSubscription();
    const txReceipt = await tx.wait();
    subId = txReceipt.events[0].args.subId;
    await VRFCoordinatorV2_5Mock.fundSubscription(subId, fundSubscription);
  } else {
    VRFCoordinatorV2_5Mock_address = networkConfig[chainId]["vrfCoordinatorV2_5"];
    subId = networkConfig[chainId]["subscriptionId"];
    log(`Subscription ID: ${subId}`);
    log(`VRFCoordinatorV2_5Mock address: ${VRFCoordinatorV2_5Mock_address}`);
  }


  const subscriptionId = subId;
  const entranceFee = networkConfig[chainId]["entranceFee"];
  const keyHash = networkConfig[chainId]["keyHash"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const interval = networkConfig[chainId]["interval"];
  const args = [
    VRFCoordinatorV2_5Mock_address,
    subscriptionId,
    entranceFee,
    keyHash,
    callbackGasLimit,
    interval
  ];

  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(raffle.address, arguments)
  }

  log("----------------------------------------------------");
  log("Deploying Raffle...");
  log("----------------------------------------------------");

  log("Raffle deployed at:", raffle.address);
}
module.exports.tags = ["all", "raffle"]