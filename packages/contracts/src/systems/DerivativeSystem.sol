// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {getKeysWithValue} from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import {getUniqueEntity} from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import {
    Name,
    Creator,
    Caption,
    DerivativeIdIncrement,
    Minted,
    TemplateKey,
    GameConfig,
    Reserved
} from "../codegen/index.sol";
import {IMemeWorld} from "../IMemeWorld.sol";
import {DrawableSystem} from "../DrawableSystem.sol";
import {templateIdToEntityKey, derivativeIdToEntityKey, getReservationEntityKey} from "../entityKey.sol";

contract DerivativeSystem is DrawableSystem {
    function mintDerivative(uint256 templateId, string calldata caption) public returns (uint256) {
        bytes32 templateEntityKey = templateIdToEntityKey(templateId);
        require(Minted.get(templateEntityKey), "template not minted");

        uint256 derivativeId = DerivativeIdIncrement.get();
        bytes32 derivativeEntityKey = derivativeIdToEntityKey(derivativeId);

        bytes32 reservationEntityKey = getReservationEntityKey(templateId, derivativeId);
        require(!Reserved.get(reservationEntityKey), "already taken");

        Reserved.set(reservationEntityKey, true);
        Caption.set(derivativeEntityKey, caption);
        Creator.set(derivativeEntityKey, _msgSender());
        TemplateKey.set(derivativeEntityKey, templateEntityKey);
        DerivativeIdIncrement.set(derivativeId + 1);

        IMemeWorld(GameConfig.getContractAddress()).mint(_msgSender(), derivativeId);

        return derivativeId;
    }

    function derivativeTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes32 entityKey = derivativeIdToEntityKey(tokenId);
        bytes32 templateEntityKey = TemplateKey.get(entityKey);
        string memory svgPaths = generateSVGPaths(templateEntityKey);
        string memory caption = Caption.get(entityKey);

        bytes memory image = abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<?xml version="1.0" encoding="UTF-8"?>',
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 420 420" width="420" height="420">',
                        svgPaths,
                        "</svg>"
                    )
                )
            )
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"', caption, '", "image":"', image, '", "description": "', caption, '"}'
                        )
                    )
                )
            )
        );
    }

    function getContractAddress() public view returns (address) {
        return GameConfig.getContractAddress();
    }
}
