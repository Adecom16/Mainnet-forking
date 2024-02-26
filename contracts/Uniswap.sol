// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

interface IUniswapRouter {
    function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts);
    function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
}

contract UniswapInteraction {
    address private immutable uniswapRouter;

    constructor(address _uniswapRouter) {
        uniswapRouter = _uniswapRouter;
    }

    function getAmountsOut(address tokenIn, address tokenOut, uint amountIn) external view returns (uint[] memory) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        return IUniswapRouter(uniswapRouter).getAmountsOut(amountIn, path);
    }

    function swapTokensForExactTokens(address tokenIn, address tokenOut, uint amountIn, uint amountOutMin, address to, uint deadline) external {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        // Approve spending of tokens
        IERC20(tokenIn).approve(uniswapRouter, amountIn);

        // Perform the swap
        IUniswapRouter(uniswapRouter).swapTokensForExactTokens(amountIn, amountOutMin, path, to, deadline);
    }
}
