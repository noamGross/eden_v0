// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";


contract TIS is ERC20 {
    uint constant _initial_supply = 100 * (10**18);
    constructor() ERC20("TEL AVIV STOCK EXCHANGE DIGITAL NIS", "TASE-NIS2") {
        _mint(msg.sender, _initial_supply);
    }

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }
}