// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Tester is ERC1155, Ownable {

    constructor() ERC1155("") Ownable(msg.sender) {
        _mint(msg.sender, 1, 100, "");
    }
    function mint(address account, uint256 tokenId, uint256 amount) public onlyOwner {
        _mint(account, tokenId, amount, "");
    }
}
