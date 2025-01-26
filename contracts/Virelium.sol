// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Virelium {
    string  public name = "Virelium";
    string  public symbol = "VREL";
    string  public standard = "Virelium v1.0";
    uint8   public decimals = 18;
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    // Mappings to track balances and allowances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    // Constructor to initialize the token with the initial supply
    // The deployer's address will receive the entire initial supply
    constructor(uint256 _initialSupply) public {
        require(_initialSupply > 0, "Initial supply must be greater than zero");

        totalSupply = _initialSupply * (10 ** uint256(decimals)); // Adjust the supply to include decimals
        balanceOf[msg.sender] = totalSupply;
        // Emit a transfer event from the "zero address" to the deployer's address
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    // Function to transfer tokens from one address to another
    // Emits a Transfer event upon successful transfer
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Check if sender has enough balance to send
        require(balanceOf[msg.sender] >= _value, "Insufficient balance to transfer tokens");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // Emit Transfer event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    // Function to approve a spender to spend tokens on behalf of the sender
    // Emits an Approval event upon successful approval
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // Ensure that the approved value is not zero
        require(_value > 0, "Approval value must be greater than zero");

        allowance[msg.sender][_spender] = _value;
        // Emit Approval event
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    // Function to transfer tokens on behalf of an owner (via an approved spender)
    // Emits a Transfer event upon successful transfer
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // Check if the sender is allowed to transfer the tokens on behalf of the owner
        require(_value <= balanceOf[_from], "Insufficient balance to transfer tokens from the owner");
        require(_value <= allowance[_from][msg.sender], "Allowance exceeded for the spender");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        // Emit Transfer event
        emit Transfer(_from, _to, _value);
        return true;
    }
}