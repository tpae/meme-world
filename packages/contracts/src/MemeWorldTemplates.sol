// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IWorld} from "./codegen/world/IWorld.sol";
import {IMemeWorld} from "./IMemeWorld.sol";

contract MemeWorldTemplates is IMemeWorld, ERC721, ERC721Enumerable, AccessControl {
    IWorld private _world;

    constructor(address worldAddress) ERC721("Meme World Templates", "MEWT") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _world = IWorld(worldAddress);
    }

    function mint(address to, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _world.templateTokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return ERC721Enumerable._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        ERC721Enumerable._increaseBalance(account, amount);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl, IERC165)
        returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) || ERC721Enumerable.supportsInterface(interfaceId)
            || AccessControl.supportsInterface(interfaceId);
    }
}
