const { verify } = require("../../utils/verify");


async function main() {
  const { ignition } = require("hardhat");
  const raffle = await ignition.deployments.get("RaffleModule", "raffle");
  const args = [
    raffle.args[0], // entrance fee,
    raffle.args[1], //  VRF Coordinator address
    raffle.args[2], // subscriptionId
    raffle.args[3], // keyHash
    raffle.args[4], // callback gas limit
    raffle.args[5], // interval
  ];
  console.log("🔍 Verifying Raffle at:", raffle.target);
  await verify(raffle.target, args);
  console.log("✅ Verified!");
}

main().catch((err) => {
  console.error("❌ Verify failed:", err);
  process.exit(1);
});