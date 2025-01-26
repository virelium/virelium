const Virelium = artifacts.require("./Virelium.sol");
const TokenSale = artifacts.require("./TokenSale.sol");

contract("TokenSale", (accounts) => {
  const initialSupply = web3.utils.toWei("1000000", "ether");
  const tokenPrice = web3.utils.toWei("0.01", "ether");
  const tokensToBuy = 10; // Number of tokens to purchase
  let tokenInstance, tokenSaleInstance;

  beforeEach(async () => {
    tokenInstance = await Virelium.new(initialSupply, { from: accounts[0] });
    tokenSaleInstance = await TokenSale.new(tokenInstance.address, tokenPrice, { from: accounts[0] });

    await tokenInstance.transfer(tokenSaleInstance.address, initialSupply, { from: accounts[0] });
  });

  it("initializes the contract with the correct values", async () => {
    const price = await tokenSaleInstance.tokenPrice();
    const contractToken = await tokenSaleInstance.tokenContract();

    assert.equal(price.toString(), tokenPrice, "Token price should match");
    assert.equal(contractToken, tokenInstance.address, "Token contract address should match");
  });

  it("facilitates token buying", async () => {
    const value = web3.utils.toWei("0.1", "ether"); // tokensToBuy * tokenPrice
    const tokensToBuyWei = web3.utils.toWei(tokensToBuy.toString(), "ether"); // Convert tokens to wei
    const receipt = await tokenSaleInstance.buyTokens(tokensToBuyWei, { from: accounts[1], value });
    const buyerBalance = await tokenInstance.balanceOf(accounts[1]);
    const contractBalance = await tokenInstance.balanceOf(tokenSaleInstance.address);

    assert.equal(buyerBalance.toString(), tokensToBuyWei, "Buyer should receive the correct number of tokens");
    assert.equal(contractBalance.toString(), web3.utils.toWei("999990", "ether"), "Contract balance should decrease");
    assert.equal(receipt.logs.length, 1, "should trigger one event");
    assert.equal(receipt.logs[0].event, "Sell", "should emit Sell event");
  });

  it("ends the token sale", async () => {
    const adminBalanceBefore = await tokenInstance.balanceOf(accounts[0]);

    await tokenSaleInstance.endSale({ from: accounts[0] });

    const adminBalanceAfter = await tokenInstance.balanceOf(accounts[0]);
    const contractBalance = await web3.eth.getBalance(tokenSaleInstance.address);

    assert.equal(adminBalanceAfter.toString(), adminBalanceBefore.add(web3.utils.toBN(initialSupply)).toString(), "Admin should receive remaining tokens");
    assert.equal(contractBalance, "0", "Contract ETH balance should be 0");
  });

  it("prevents non-admin from ending the sale", async () => {
    try {
      await tokenSaleInstance.endSale({ from: accounts[1] });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.reason === "Only the admin can end the sale", "Revert reason should match");
    }
  });
});
