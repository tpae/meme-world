// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IWorld} from "./codegen/world/IWorld.sol";
import {IMemeWorld} from "./IMemeWorld.sol";

contract MemeWorld is IMemeWorld, ERC721, AccessControl {
    IWorld private _world;

    constructor(address worldAddress) ERC721("Meme World", "MEW") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _world = IWorld(worldAddress);
    }

    function mint(address to, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _world.derivativeTokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, IERC165, AccessControl)
        returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId)
            || super.supportsInterface(interfaceId);
    }
}
