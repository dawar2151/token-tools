pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Tester is ERC20, Ownable {

    constructor() ERC20("Tester", "TST") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
}