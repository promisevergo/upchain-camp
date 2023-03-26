// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyToken is Initializable, ERC20Upgradeable, UUPSUpgradeable {
    function initialize(string memory name, string memory symbol) initializer public {
        __ERC20_init(name, symbol);
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}
}


contract MyTokenV2 is Initializable, ERC20Upgradeable, UUPSUpgradeable {
    function initialize(string memory name, string memory symbol) initializer public {
        __ERC20_init(name, symbol);
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function transferWithCallback(address from, uint256 amount) public {
        
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}
}