// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenERC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("Promise", "PR") {
        _mint(msg.sender, initialSupply);
    }
}


contract Valut {
    address owner;
    mapping(address => uint256) public all_balance;
    mapping(address => mapping(address => uint256)) public balances;
    constructor() payable {
        owner = msg.sender;
    }

    function deposit(address token, uint256 amount) public {
        require(token != address(0), "token address is invalid");
        require(amount > 0, "amount is invalid");
        require(ERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        balances[token][msg.sender] += amount;
        all_balance[token] += amount;
    }

    function withdraw(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[token][msg.sender] >= amount, "Insufficient balance");
        require(all_balance >= amount, "Vault balance is insufficient");
        
        balances[token][msg.sender] -= amount;
        all_balance[token] -= amount;
        require(ERC20(token).transfer(msg.sender, amount), "Token transfer failed");
    }

    function rug(address token, uint256 amount) public{
        require(owner==msg.sender, "Only owner can rug");
        require(amount > 0, "Amount must be greater than 0");
        require(all_balance[token] >= amount, "Vault balance is insufficient");
        all_balance[token] -= amount;
        require(ERC20(token).transfer(msg.sender, amount), "Token transfer failed");
    }
}