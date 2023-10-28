// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IMemeWorld is IERC721 {
    function mint(address to, uint256 tokenId) external;
}
