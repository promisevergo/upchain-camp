// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721(unicode"PROMISE NFT", "PR_NFT"){}

    function mint(address addr, string memory tokenURI) public returns (uint256){
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(addr, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}

contract TokenERC20 is ERC20 {
    address public owner ;
    constructor(uint256 initialSupply) ERC20("Promise", "PR") {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }
}

contract NFTmarket {
    address public NFTAddr;
    address public TokenAddr;

    mapping(uint256=>address) _tokenOwner;
    mapping(uint256=>uint256) _tokenPrice;
    constructor(address _NFTaddress, address _Tokenaddress){
        NFTAddr = _NFTaddress;
        TokenAddr = _Tokenaddress;
    }

    function NFTShelves(uint256 _tokenID, uint256 _Price) public
    {
        require(_Price>0, "price can't down zero");
        ERC721(NFTAddr).transferFrom(msg.sender, address(this), _tokenID);
        _tokenOwner[_tokenID] = msg.sender;
        _tokenPrice[_tokenID] = _Price;
    }

    function GetPrice(uint256 _tokenID) public view returns (uint256)
    {
        require(_tokenPrice[_tokenID]!=0, "The tokenID is not on the shelves");
        return _tokenPrice[_tokenID];
    }

    function BuyNFT(uint256 _tokenID, address to) public 
    {
        address token_owner = _tokenOwner[_tokenID];
        uint256 token_amount = _tokenPrice[_tokenID];
        ERC20(TokenAddr).transferFrom(to, token_owner, token_amount);
        ERC721(NFTAddr).transferFrom(address(this), to, _tokenID);
        _tokenOwner[_tokenID] = address(0);
        _tokenPrice[_tokenID] = 0;
    }

}