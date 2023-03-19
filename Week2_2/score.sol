
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract Score{
    mapping(address=>mapping(string=>uint16)) public ScoreNum;
    address public owner;
    address[] public teacherArr;
    constructor() payable{
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(owner==msg.sender, "only owner can option");
        _;
    }

    modifier onlyTeacher() {
        uint len = 0;
        uint i=0;
        len = teacherArr.length;
        for( ; i<len; i++){
            if(teacherArr[i] == msg.sender)
                break;
        }
        require(i<len, "only teachers can option");
        _;

    }

    function addTeacher(address _new) public onlyOwner{
        teacherArr.push(_new);
    }

    function delTeacher(address _del) public onlyOwner{
        uint len = 0;
        len = teacherArr.length;
        for(uint i=0; i<len; i++){
            if(teacherArr[i] == _del)
            {
                teacherArr[len-1] = teacherArr[i];
                teacherArr.pop();
                break;
            }
        }
    }

    function Write(address _stu, string memory ob, uint16 _score) public onlyTeacher{
        require(_score<100, "score can't more 100");
        ScoreNum[_stu][ob] = _score;
    }
}

contract teacher{
    address scoreAddr;
    string write;
    bytes callAbi;
    
    constructor(address _addr, string memory _write) {
        scoreAddr = _addr;
        write = _write;
    }

    function Write(address _stu, string memory _ob, uint16 _score) public{
        (bool success, ) = scoreAddr.call(abi.encodeWithSignature(write, _stu, _ob, _score));
        require(success, "trans fail");
    }

}