const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper/helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;
  let subId;
  const fundSubscription = ether.utils.parseEther("30"); // 0.1 LINK per request
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
    const VRFCoordinatorV2_5Mock = await ether.getContract("VRFCoordinatorV2_5Mock");
    log(`VRFCoordinatorV2_5Mock deployed at ${VRFCoordinatorV2_5Mock.address}`);
    const tx = await vrfCoordinator.createSubscription();
    const txReceipt = await tx.wait();
    subId = txReceipt.events[0].args.subId;
    await vrfCoordinator.fundSubscription(subId, fundSubscription);
  } else {
    VRFCoordinatorV2_5Mock_address = networkConfig[chainId]["vrfCoordinatorV2_5"];
    subId = networkConfig[chainId]["subscriptionId"];
    log(`Subscription ID: ${subId}`);
    log(`VRFCoordinatorV2_5Mock address: ${VRFCoordinatorV2_5Mock_address}`);
  }
  log("----------------------------------------------------");
  log("Deploying Raffle...");
  log("----------------------------------------------------");

  const entranceFee = networkConfig[chainId]["entranceFee"];
  const keyHash = networkConfig[chainId]["keyHash"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const interval = networkConfig[chainId]["interval"];
  const args = [
    VRFCoordinatorV2_5Mock_address,
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

  log("Raffle deployed at:", raffle.address);
}