async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Deploy AVSAuthentication
    const AVSAuthentication = await ethers.getContractFactory("AVSAuthentication");
    const avsAuth = await AVSAuthentication.deploy();
    await avsAuth.deployed();
    console.log("AVSAuthentication deployed to:", avsAuth.address);
  
    // Deploy LiquidityEventLogger
    const LiquidityEventLogger = await ethers.getContractFactory("LiquidityEventLogger");
    const liquidityLogger = await LiquidityEventLogger.deploy();
    await liquidityLogger.deployed();
    console.log("LiquidityEventLogger deployed to:", liquidityLogger.address);
  
    // Deploy RebalanceModule
    const RebalanceModule = await ethers.getContractFactory("RebalanceModule");
    const rebalanceModule = await RebalanceModule.deploy();
    await rebalanceModule.deployed();
    console.log("RebalanceModule deployed to:", rebalanceModule.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });