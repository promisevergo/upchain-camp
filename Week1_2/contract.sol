pragma solidity ^0.8.0

contract Counter{
    uint public counter;
    address owner;
    constructor(uint x){
        counter = x;
        owner = msg.sender;
    }

    function count() public{
        require(msg.sender == owner, "Only owner can call this function");
        counter = counter + 1;
    }
}