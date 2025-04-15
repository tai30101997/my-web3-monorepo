const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MockVRFModule = buildModule("MockVRFModule", (m) => {
  const baseFee = m.getParameter("baseFee", "100000000000000000"); // 0.1 LINK
  const gasPriceLink = m.getParameter("gasPriceLink", 1e9); // 0.000000001 LINK per gas
  const weiPerUnitLink = m.getParameter("weiPerUnitLink", "1000000000000000000"); // Conversion rate

  const vrfCoordinator = m.contract("VRFCoordinatorV2_5Mock", [baseFee, gasPriceLink, weiPerUnitLink]);

  const subscription = m.call(vrfCoordinator, "createSubscription", []);
  const subId = m.readEventArgument(subscription, "SubscriptionCreated", "subId");

  m.call(vrfCoordinator, "fundSubscription", [subId, "30000000000000000000"]); // 30 LINK

  return { vrfCoordinator, subId };
});

module.exports = MockVRFModule;