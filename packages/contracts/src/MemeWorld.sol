// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IWorld} from "./codegen/world/IWorld.sol";

contract MemeWorld is ERC721, AccessControl {
    IWorld private _world;

    constructor(address worldAddress) ERC721("Meme World", "MEMET") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _world = IWorld(worldAddress);
    }

    function mint(address to, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _world.templateTokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
