pragma solidity ^0.8.0;

contract SimpleMath {
    uint256 public num;
    constructor() public {
        num = 0;
    }
    function add() public {
        num += 1;
    }

    function sub() public {
        if (num > 0) {
            num -= 1;
        }
    }
}
