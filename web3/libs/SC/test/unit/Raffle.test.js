const { assert, expect } = require("chai");
const { developmentChains, networkConfig } = require("../../helper/helper-hardhat-config");
const { ethers, network, getNamedAccounts, deployments } = require("hardhat");
!developmentChains.includes(network.name) ? describe.skip : describe("Raffle Unit Tests", function () {
  let raffle, VRFCoordinatorV2_5Mock, entranceFee, deployer, interval;
  let chainId = network.config.chainId;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]); // deploy all contracts
    raffle = await ethers.getContract("Raffle", deployer);
    VRFCoordinatorV2_5Mock = await ethers.getContract("VRFCoordinatorV2_5Mock", deployer);
    entranceFee = await raffle.getEntranceFee();
    interval = await raffle.getInterval();

  });

  describe("constructor", async function () {
    it("initializes the raffle correctly", async function () {
      const raffleState = await raffle.getRaffleState();
      assert.equal(raffleState.toString(), "0");
      assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
    });
  })

  describe("enterRaffle", async function () {
    it("reverts when you don't pay enough", async function () {
      await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__NotEnoughETHEntered");
    });
    it("revert when raffle is calculating", async function () {
      await raffle.enterRaffle({ value: entranceFee });
      await expect(raffle.enterRaffle({ value: entranceFee })).to.be.revertedWith("Raffle__RaffleNotOpen");
    })
    it("records players when they enter", async function () {
      await raffle.enterRaffle({ value: entranceFee });
      const playerFromContract = await raffle.getPlayer(0);
      assert.equal(playerFromContract, deployer);
    });
    it("emits event on enter", async function () {
      await expect(raffle.enterRaffle({ value: entranceFee })).to.emit(raffle, "RaffleEnter");
    })
    it("doesn't allow entrance when raffle is calculating", async function () {
      await raffle.enterRaffle({ value: entranceFee });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);// just wanna mine the 1 block 
      // we pretend to be a chainlink keeper
      await raffle.performUpkeep([]); // this will change the state of the raffle to calculating
      await expect(raffle.enterRaffle({ value: entranceFee })).to.be.revertedWith("Raffle__RaffleNotOpen");
    })
  })
  describe("checkUpKeep", async function () {

    it("returns false if people haven't sent any ETH", async function () {
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
      assert(!upkeepNeeded);
    })
    it("returns false if raffle isn't open", async function () {
      await raffle.enterRaffle({ value: entranceFee });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);// just wanna mine the 1 block 
      await raffle.performUpkeep([]); // this will change the state of the raffle to calculating
      const raffleState = await raffle.getRaffleState();
      const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
      assert.equal(raffleState.toString(), "1");
      assert.equal(upkeepNeeded, false);
    });

  });
  describe("performUpkeep", async function () {
    it("can only run if checkUpkeep is true", async function () {
      await raffle.enterRaffle({ value: entranceFee });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);// just wanna mine the 1 block
      const tx = await raffle.performUpkeep([]);
      assert(tx);
    })
    it("reverts when checkUpkeep is false", async function () {
      expect(raffle.performUpkeep([])).to.be.revertedWith("Raffle__UpkeepNotNeeded");
    })
    it("updates the raffle state and emits a requestId", async function () {
      await raffle.enterRaffle({ value: entranceFee });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);// just wanna mine the 1 block
      const txResponse = await raffle.performUpkeep([]);
      const txReceipt = await txResponse.wait(1);
      const raffleState = await raffle.getRaffleState();
      const requestId = txReceipt.events[1].args.requestId;
      assert(requestId.toNumber() > 0);
      assert(raffleState.toString() == "1");
    })
  });

  describe("fulfillRandomWords", async function () {
    beforeEach(async function () {
      await raffle.enterRaffle({ value: entranceFee });
      await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]);
      await network.provider.send("evm_mine", []);// just wanna mine the 1 block
    });
    it("can only be called after performUpkeep", async function () {
      await expect(VRFCoordinatorV2_5Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith("InvalidRequest");
      await expect(VRFCoordinatorV2_5Mock.fulfillRandomWords(1, raffle.address)).to.be.revertedWith("InvalidRandomWords");

    })
    it("picks a winner, resets the lottery, and sends money", async function () {
      const additionalEntrances = 3;
      const startingIndex = 2; // deployer = 0
      const accounts = await ethers.getSigners();
      for (let i = startingIndex; i < startingIndex + additionalEntrances; i++) {
        const accountConnectedRaffle = await raffle.connect(accounts[i]);
        await accountConnectedRaffle.enterRaffle({ value: entranceFee });

      }
      const startingTimeStamp = await raffle.getLatestTimestamp();
      // performUpkeep (mock being chainlink keepers)
      await new Promise((resolve, reject) => {
        raffle.once("WinnerPicked", async () => {
          try {
            const recentWinner = await raffle.getRecentWinner();
            const raffleState = await raffle.getRaffleState();
            const endingTimeStamp = await raffle.getLatestTimestamp();
            const winnerStartingBalance = await accounts[1].getBalance();
            const numPlayers = await raffle.getNumberOfPlayers();
            assert.equal(numPlayers.toString(), "0");
            assert.equal(raffleState.toString(), "0");
            assert(endingTimeStamp > startingTimeStamp);
            assert.equal(
              winnerStartingBalance.toString(),
              winnerStartingBalance.add(entranceFee.mul(additionalEntrances).add(entranceFee)).toString()
            );
            assert.equal(recentWinner.toString(), accounts[1].address);

          } catch (e) {
            reject(e);
          }
          resolve();

          const tx = await raffle.performUpkeep([]);
          const txReceipt = await tx.wait(1);
          const winnerStartingBalance = await accounts[1].getBalance();
          await VRFCoordinatorV2_5Mock.fulfillRandomWords(txReceipt.events[1].args.requestId, raffle.address);
        })
      });
    })
  })
});
