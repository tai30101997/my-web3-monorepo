const { assert, expect } = require("chai");
const { developmentChains, networkConfig } = require("../../helper/helper-hardhat-config");
const { ethers, network, getNamedAccounts, deployments } = require("hardhat");
!developmentChains.includes(network.name) ? describe.skip :
  describe("Raffle Stag Tests", function () {
    let raffle, entranceFee, deployer;
    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer;
      raffle = await ethers.getContract("Raffle", deployer);
      entranceFee = await raffle.getEntranceFee();
    });
    describe("fulfillRandomWords", async function () {

      it("work with chainlink keepers and VRF", async function () {

        const startingTimeStamp = await raffle.getLatestTimestamp();
        const deployerAccount = await ethers.getSigner(deployer);
        const winnerStartingBalance = await deployerAccount.getBalance()
        await new Promise(async (resolve, reject) => {
          raffle.once("WinnerPicked", async () => {
            console.log("WinnerPicked event fired");
            try {
              const recentWinner = await raffle.getRecentWinner();
              const raffleState = await raffle.getRaffleState();
              const winnerEndingBalance = await deployerAccount.getBalance();
              const endingTimeStamp = await raffle.getLatestTimestamp();
              await expect(raffle.getPlayer(0)).to.be.reverted;
              assert.equal(recentWinner.toString(), deployerAccount.address);
              assert.equal(raffleState.toString(), "0");
              assert.equal(
                winnerEndingBalance.toString(),
                winnerStartingBalance.add(entranceFee).toString()
              );
              assert(endingTimeStamp > startingTimeStamp);
              resolve();

            } catch (error) {
              console.log(error);
              reject(error);
            }

          })
          const tx = await raffle.enterRaffle({ value: entranceFee });
          await tx.wait(1)
          console.log("Ok, time to wait...")
        });

      });

    })
  });