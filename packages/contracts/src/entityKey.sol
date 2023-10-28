// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

function templateIdToEntityKey(uint256 templateId) pure returns (bytes32) {
    return keccak256(abi.encodePacked("template", templateId));
}

function derivativeIdToEntityKey(uint256 derivativeId) pure returns (bytes32) {
    return keccak256(abi.encodePacked("derivative", derivativeId));
}

function getReservationEntityKey(uint256 templateId, uint256 derivativeId) pure returns (bytes32) {
    return keccak256(abi.encodePacked("reservation", templateId, derivativeId));
}
