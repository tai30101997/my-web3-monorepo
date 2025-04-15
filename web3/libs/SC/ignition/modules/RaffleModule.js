
// ignition/modules/RaffleModule.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const MockVRFModule = require("./MockVRFModule.js");

const RaffleModule = buildModule("RaffleModule", (m) => {
  const { vrfCoordinator, subId } = m.useModule(MockVRFModule);
  const entranceFee = m.getParameter("entranceFee", "10000000000000000");
  const keyHash = m.getParameter("keyHash", "0x6c3699283bda56ad74f6b855546325b68d482e983852a64ee2f2b938d3db16d9");
  const callbackGasLimit = m.getParameter("callbackGasLimit", 500000);
  const interval = m.getParameter("interval", 30);

  const raffle = m.contract("Raffle", [
    entranceFee,
    vrfCoordinator,
    subId,
    keyHash,
    callbackGasLimit,
    interval
  ]);
  m.call(vrfCoordinator, "addConsumer", [subId, raffle]);
  const raffleAddress = m.getParameter("raffleAddress", raffle.address);
  return { raffle };
});

module.exports = RaffleModule;

//

/**
npx hardhat ignition deploy ignition/modules/RaffleModule.js
npx hardhat ignition deploy ignition/modules/RaffleModule.js --network sepolia
*/