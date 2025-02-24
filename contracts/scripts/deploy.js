const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy AVSAuthentication
    const AVSAuthentication = await ethers.getContractFactory("AVSAuthentication");
    const avsAuth = await AVSAuthentication.deploy();
    await avsAuth.waitForDeployment();
    console.log("AVSAuthentication deployed to:", avsAuth.target);
  
    // Deploy LiquidityEventLogger
    const LiquidityEventLogger = await ethers.getContractFactory("LiquidityEventLogger");
    const liquidityLogger = await LiquidityEventLogger.deploy();
    await liquidityLogger.waitForDeployment();
    console.log("LiquidityEventLogger deployed to:", liquidityLogger.target);
  
    // Deploy RebalanceModule
    const RebalanceModule = await ethers.getContractFactory("RebalanceModule");
    const rebalanceModule = await RebalanceModule.deploy();
    await rebalanceModule.waitForDeployment();
    console.log("RebalanceModule deployed to:", rebalanceModule.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });