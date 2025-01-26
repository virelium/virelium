// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

import "./Virelium.sol";

contract TokenSale {
    address payable public admin;
    Virelium public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    uint256 public saleEndTime;

    event Sell(address indexed _buyer, uint256 _amount);
    // Constructor for the TokenSale contract
    constructor(Virelium _tokenContract, uint256 _tokenPrice, uint256 _saleDuration) public {
        admin = msg.sender; // Simplified address assignment
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        saleEndTime = now + _saleDuration;
    }
    // Safe multiplication function
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "Multiplication overflow");
    }
    // Function to buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(now < saleEndTime, "Token sale has ended");
        require(msg.value == multiply(_numberOfTokens, tokenPrice), "Incorrect ETH amount sent");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Not enough tokens available");
        // Transfer tokens to the buyer
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "Token transfer failed");

        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }
    // End the sale and transfer any remaining tokens and ETH to the admin
    function endSale() public {
        require(msg.sender == admin, "Only the admin can end the sale");
        uint256 remainingTokens = tokenContract.balanceOf(address(this));
        require(tokenContract.transfer(admin, remainingTokens), "Token transfer failed");
        admin.transfer(address(this).balance); // Transfer ETH balance to admin
    }
    // Return true if the sale is still ongoing
    function isSaleOngoing() public view returns (bool) {
        return now < saleEndTime;
    }
}