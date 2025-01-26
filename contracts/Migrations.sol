// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Migrations {
    address public owner;
    uint public last_completed_migration;
    // Modifier to restrict access to only the owner of the contract
    modifier restricted() {
        require(msg.sender == owner, "This function is restricted to the contract's owner");
        _;
    }
    // Constructor that sets the deployer's address as the owner
    constructor() public {
        owner = msg.sender;
    }
    // Function to set the completed migration number
    // Restricted to only the owner of the contract
    function setCompleted(uint completed) public restricted {
        // Ensure the completed migration number is valid
        require(completed > last_completed_migration, "Completed migration number must be greater than the last completed migration");
        last_completed_migration = completed;
    }
    // Function to upgrade the contract and transfer control to the new contract address
    // Restricted to only the owner of the contract
    function upgrade(address new_address) public restricted {
        // Ensure the new address is valid
        require(new_address != address(0), "New contract address must be a valid address");

        Migrations upgraded = Migrations(new_address);
        // Transfer the state of the current migration to the new contract
        upgraded.setCompleted(last_completed_migration);
    }
}