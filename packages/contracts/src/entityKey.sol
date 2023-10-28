// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

function templateIdToEntityKey(uint256 templateId) pure returns (bytes32) {
    return keccak256(abi.encodePacked(templateId));
}
