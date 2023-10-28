// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract MemeWorldTemplates is ERC721, AccessControl {
    constructor() ERC721("Meme World Templates", "MEMET") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function mint(address to, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
