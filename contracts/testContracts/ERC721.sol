// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Tester is ERC721, Ownable {

    constructor() ERC721("Tester", "TST") Ownable(msg.sender) {
    }
    function mint(address account, uint256 tokenId) public onlyOwner {
        _mint(account, tokenId);
    }
}