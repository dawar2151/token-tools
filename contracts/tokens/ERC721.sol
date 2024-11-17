// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Token is ERC721, Ownable {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
    }
    function mint(address account, uint256 tokenId) public onlyOwner {
        _mint(account, tokenId);
    }
}