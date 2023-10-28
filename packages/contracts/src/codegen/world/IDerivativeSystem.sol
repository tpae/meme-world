// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

/**
 * @title IDerivativeSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IDerivativeSystem {
  function mintDerivative(uint256 templateId, string calldata caption) external returns (uint256);

  function derivativeTokenURI(uint256 tokenId) external view returns (string memory);

  function getContractAddress() external view returns (address);
}
