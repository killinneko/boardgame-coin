// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlayerCoin is ERC20, ERC20Burnable, Ownable {
    uint8 private _decimals;

    constructor(
        address initialOwner
    ) ERC20("PlayerCoin", "PCS") Ownable(initialOwner) {
        _decimals = 2; // 小数点2桁
        _mint(initialOwner, 10000 * 10 ** _decimals); // 初期供給 (例: 10,000.00トークン)
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
