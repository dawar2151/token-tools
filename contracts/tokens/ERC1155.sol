// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Token is ERC1155, Ownable {

    constructor(string memory baseUri) ERC1155(baseUri) Ownable(msg.sender) {
    }
    function mint(address account, uint256 tokenId, uint256 amount) public onlyOwner {
        _mint(account, tokenId, amount, "");
    }
    function burn(address account, uint256 tokenId, uint256 amount) public onlyOwner {
        _burn(account, tokenId, amount);
    }
}
