var Virelium = artifacts.require("./Virelium.sol");
var TokenSale = artifacts.require("./TokenSale.sol");

module.exports = async function (deployer) {
  // Deploy Virelium contract with an initial supply
  const initialSupply = web3.utils.toWei("1000000", "ether");
  await deployer.deploy(Virelium, initialSupply);
  // Get deployed Virelium contract
  const tokenContract = await Virelium.deployed();
  // Deploy TokenSale contract with the deployed Virelium contract and token price
  const tokenPrice = web3.utils.toWei("0.01", "ether"); // Price per token
  const saleDuration = 3600 * 24 * 7; // 1 week
  await deployer.deploy(TokenSale, tokenContract.address, tokenPrice, saleDuration);
};
