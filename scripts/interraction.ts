import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
  try {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    await helpers.impersonateAccount(USDCHolder);
    const impersonatedSigner = await ethers.getSigner(USDCHolder);

    const amountOut = ethers.parseUnits("2000", 6); 
    const amountIn = ethers.parseUnits("1980", 18); 

    const USDC = await ethers.getContractAt(
      "IERC20",
      USDCAddress,
      impersonatedSigner
    );
    const DAI = await ethers.getContractAt("IERC20", DAIAddress);
    const ROUTER = await ethers.getContractAt(
      "IUniswapRouter",
      UNIRouter,
      impersonatedSigner
    );

    await USDC.approve(UNIRouter, amountOut);

    const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI.balanceOf(impersonatedSigner.address);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    console.log("Balance before swap:");
    console.log("USDC:", ethers.formatUnits(usdcBal, 6)); 
    console.log("DAI:", ethers.formatUnits(daiBal, 18)); 

    await ROUTER.swapTokensForExactTokens(
      amountOut,
      amountIn,
      [USDCAddress, DAIAddress],
      impersonatedSigner.address,
      deadline
    );

    const usdcBalAfter = await USDC.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI.balanceOf(impersonatedSigner.address);

    console.log("Balance after swap:");
    console.log("USDC:", ethers.formatUnits(usdcBalAfter, 6)); 
    console.log("DAI:", ethers.formatUnits(daiBalAfter, 18)); // Standard 18 decimals
  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  }
};

main();
