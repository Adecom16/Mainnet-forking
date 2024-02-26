import { ethers } from "hardhat";
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await impersonateAccount(USDCHolder);
  const impersonatedSigner = await ethers.getSigner(USDCHolder);

  const USDC = await ethers.getContractAt(
    "IERC20",
    USDCAddress,
    impersonatedSigner
  );
  const ROUTER = await ethers.getContractAt(
    "IUniswapRouter",
    UNIRouter,
    impersonatedSigner
  );

  const amountIn = ethers.parseUnits("100", 6); // Reduced the amount for testing
  const amountOutMin = ethers.parseUnits("197", 18); // Adjusted the minimum output amount for testing

  const path = [USDCAddress, DAIAddress];
  const recipient = impersonatedSigner.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  // Approve USDC transfer to the router
  await USDC.approve(UNIRouter, amountIn);

  // Get the expected output amount
  const amounts = await ROUTER.getAmountsOut(amountIn, path);
  console.log(
    "Expected output amount:",
    ethers.formatUnits(amounts[1], 18),
    "DAI"
  );

  // Perform the swap
  await ROUTER.swapTokensForExactTokens(
    amountOutMin,
    amountIn,
    path,
    recipient,
    deadline,
    { gasLimit: 500000 } // Adjust gas limit as needed
  );

  // Check balances after the swap
  const usdcBalAfter = await USDC.balanceOf(recipient);
  const daiBalAfter = await ethers.provider.getBalance(DAIAddress);

  console.log(
    "Balances after swap - USDC:",
    ethers.formatUnits(usdcBalAfter, 6),
    "DAI:",
    ethers.formatUnits(daiBalAfter, 18)
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
