const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test suite for AVSAuthentication contract
describe("AVSAuthentication", function () {
  let AVSAuthentication, avsAuth, owner, addr1, addr2;

  // Deploy the contract before each test
  beforeEach(async function () {
    AVSAuthentication = await ethers.getContractFactory("AVSAuthentication");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    avsAuth = await AVSAuthentication.deploy();
  });

  // Test if the owner is set correctly
  it("Should set the right owner", async function () {
    expect(await avsAuth.owner()).to.equal(owner.address);
  });

  // Test adding an authenticated user
  it("Should allow the owner to add an authenticated user", async function () {
    await avsAuth.addAuthenticatedUser(addr1.address);
    expect(await avsAuth.authenticatedUsers(addr1.address)).to.be.true;
  });

  // Test that only the owner can add authenticated users
  it("Should not allow non-owner to add an authenticated user", async function () {
    await expect(
      avsAuth.connect(addr1).addAuthenticatedUser(addr2.address)
    ).to.be.revertedWith("Only owner can add users");
  });

  // Test logging an operation by an authenticated user
  it("Should allow authenticated user to log an operation", async function () {
    await avsAuth.addAuthenticatedUser(addr1.address);
    const blockBefore = await ethers.provider.getBlock("latest");
    await avsAuth.connect(addr1).logOperation("Test Operation");
    const blockAfter = await ethers.provider.getBlock("latest");
    const loggedEvent = await avsAuth.queryFilter("OperationLogged");
    const loggedTimestamp = loggedEvent[0].args[2];
    expect(loggedTimestamp).to.be.within(blockBefore.timestamp, blockAfter.timestamp);
  });

  // Test that non-authenticated users cannot log operations
  it("Should not allow non-authenticated user to log an operation", async function () {
    await expect(
      avsAuth.connect(addr1).logOperation("Test Operation")
    ).to.be.revertedWith("User not authenticated");
  });
});
