// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenERC721 is ERC721URIStorage {
    address public owner ;
    constructor() payable ERC721("PromiseNFT", "PR_NFT") {
        owner = msg.sender;
    }
}