pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {
    uint8 private _decimals = 18;
    constructor(string memory name, string memory symbol, uint8 _customDecimals, uint256 totalSupply) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, totalSupply * 10 ** _customDecimals);
        _decimals = _customDecimals;
    }
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
    function decimals() public override view virtual returns (uint8) {
        return _decimals;
    }
}
