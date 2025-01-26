const Virelium = artifacts.require("./Virelium.sol");

contract("Virelium", (accounts) => {
  const initialSupply = web3.utils.toWei("1000000", "ether"); // 1,000,000 tokens
  let tokenInstance;

  beforeEach(async () => {
    tokenInstance = await Virelium.new(initialSupply, { from: accounts[0] });
  });

  it("initializes the contract with the correct values", async () => {
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    const standard = await tokenInstance.standard();
    const totalSupply = await tokenInstance.totalSupply();

    assert.equal(name, "Virelium", "Name should be Virelium");
    assert.equal(symbol, "VREL", "Symbol should be VREL");
    assert.equal(standard, "Virelium v1.0", "Standard should be Virelium v1.0");
    assert.equal(totalSupply.toString(), initialSupply, "Total supply should match the initial supply");
  });

  it("allocates the initial supply to the admin account", async () => {
    const adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(adminBalance.toString(), initialSupply, "Admin should hold the entire initial supply");
  });

  it("transfers token ownership", async () => {
    const amount = web3.utils.toWei("100", "ether"); // 100 tokens
    const receipt = await tokenInstance.transfer(accounts[1], amount, { from: accounts[0] });

    const senderBalance = await tokenInstance.balanceOf(accounts[0]);
    const receiverBalance = await tokenInstance.balanceOf(accounts[1]);

    assert.equal(senderBalance.toString(), web3.utils.toWei("999900", "ether"), "Sender balance should decrease");
    assert.equal(receiverBalance.toString(), amount, "Receiver balance should increase");

    assert.equal(receipt.logs.length, 1, "should trigger one event");
    assert.equal(receipt.logs[0].event, "Transfer", "should emit Transfer event");
  });

  it("approves tokens for delegated transfer", async () => {
    const amount = web3.utils.toWei("50", "ether");
    const success = await tokenInstance.approve(accounts[1], amount, { from: accounts[0] });
    const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);

    assert.isTrue(success.receipt.status, "Approval should be successful");
    assert.equal(allowance.toString(), amount, "Allowance should match the approved amount");
  });

  it("handles delegated token transfers", async () => {
    const amount = web3.utils.toWei("100", "ether");
    const delegatedAmount = web3.utils.toWei("50", "ether");

    await tokenInstance.transfer(accounts[1], amount, { from: accounts[0] });
    await tokenInstance.approve(accounts[2], delegatedAmount, { from: accounts[1] });

    const receipt = await tokenInstance.transferFrom(accounts[1], accounts[3], delegatedAmount, { from: accounts[2] });

    const senderBalance = await tokenInstance.balanceOf(accounts[1]);
    const receiverBalance = await tokenInstance.balanceOf(accounts[3]);
    const allowance = await tokenInstance.allowance(accounts[1], accounts[2]);

    assert.equal(senderBalance.toString(), web3.utils.toWei("50", "ether"), "Sender balance should decrease");
    assert.equal(receiverBalance.toString(), delegatedAmount, "Receiver balance should increase");
    assert.equal(allowance.toString(), "0", "Allowance should be reduced to zero");

    assert.equal(receipt.logs.length, 1, "should trigger one event");
    assert.equal(receipt.logs[0].event, "Transfer", "should emit Transfer event");
  });
});
