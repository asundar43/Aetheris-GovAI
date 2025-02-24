const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test suite for LiquidityEventLogger contract
describe("LiquidityEventLogger", function () {
  let LiquidityEventLogger, liquidityLogger, owner, addr1;

  // Deploy the contract before each test
  beforeEach(async function () {
    LiquidityEventLogger = await ethers.getContractFactory("LiquidityEventLogger");
    [owner, addr1] = await ethers.getSigners();
    console.log("Deploying contract...");
    liquidityLogger = await LiquidityEventLogger.deploy();
    console.log("Contract deployed.");

    // Check if the contract is deployed with a valid address
    console.log("Deployed Contract Address:", liquidityLogger.address);
    expect(liquidityLogger.address).to.not.be.undefined;
    expect(liquidityLogger.address).to.not.be.null;
  });

  // Test if the LiquidityEvent is emitted correctly
  it("Should emit LiquidityEvent with correct parameters", async function () {
    const poolAddress = addr1.address;
    const amountChanged = 1000;

    const blockBefore = await ethers.provider.getBlock("latest");
    const tx = await liquidityLogger.onLiquidityChange(poolAddress, amountChanged);
    const receipt = await tx.wait();

    // Log the receipt and contract address for debugging
    console.log("Transaction Receipt:", receipt);
    console.log("Contract Address:", liquidityLogger.address);

    // Check if events are present
    expect(receipt.events).to.not.be.undefined;
    expect(receipt.events.length).to.be.greaterThan(0);

    const event = receipt.events.find(event => event.event === "LiquidityEvent");
    expect(event).to.not.be.undefined;

    const eventTimestamp = event.args[2];

    expect(event.args[0]).to.equal(poolAddress);
    expect(event.args[1]).to.equal(amountChanged);
    expect(eventTimestamp).to.be.within(blockBefore.timestamp, blockBefore.timestamp + 1);
  });
}); 