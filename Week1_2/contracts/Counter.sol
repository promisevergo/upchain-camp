// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Counter{
    uint public counter;
    address public owner;
    constructor(uint x){
        counter = x;
        owner = msg.sender;
    }

    function count() public {
        require(msg.sender == owner, "Only owner can increment");
        counter++;
        console.log(counter);
    }
}
