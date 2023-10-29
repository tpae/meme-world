// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {System} from "@latticexyz/world/src/System.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {getKeysWithValue} from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import {getUniqueEntity} from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import {Name, Creator, TemplateIdIncrement, Minted, GameConfig, Path, PathKey} from "../codegen/index.sol";
import {IMemeWorld} from "../IMemeWorld.sol";
import {DrawableSystem} from "../DrawableSystem.sol";
import {templateIdToEntityKey} from "../entityKey.sol";

contract TemplateSystem is DrawableSystem {
    event TemplateCreated(address indexed creator, uint256 indexed templateId);
    event TemplateMinted(address indexed creator, uint256 indexed templateId);

    function createTemplate(string calldata name) public returns (uint256) {
        uint256 templateId = TemplateIdIncrement.get();
        bytes32 entityKey = templateIdToEntityKey(templateId);

        Name.set(entityKey, name);
        Creator.set(entityKey, _msgSender());
        TemplateIdIncrement.set(templateId + 1);

        emit TemplateCreated(_msgSender(), templateId);

        return templateId;
    }

    function drawPaths(uint256 templateId, uint128[][] calldata paths) public {
        bytes32 entityKey = templateIdToEntityKey(templateId);
        require(!Minted.get(entityKey), "already minted");
        require(Creator.get(entityKey) == _msgSender(), "not the creator");

        bytes32 pathKey = getUniqueEntity();
        Path.set(pathKey, getPackedPaths(paths));
        PathKey.set(pathKey, entityKey);
    }

    function mintTemplate(uint256 templateId) public {
        bytes32 entityKey = templateIdToEntityKey(templateId);
        require(!Minted.get(entityKey), "already minted");
        require(Creator.get(entityKey) == _msgSender(), "not the creator");

        IMemeWorld(GameConfig.getTemplateAddress()).mint(_msgSender(), templateId);
        Minted.set(entityKey, true);

        emit TemplateMinted(_msgSender(), templateId);
    }

    function templateTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes32 entityKey = templateIdToEntityKey(tokenId);
        string memory svgPaths = generateSVGPaths(entityKey);
        string memory name = Name.get(entityKey);

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
                            '{"name":"',
                            name,
                            '", "image":"',
                            image,
                            '", "description": "This can be used on memeworld.lol to create your own memes"}'
                        )
                    )
                )
            )
        );
    }

    function getTemplateAddress() public view returns (address) {
        return GameConfig.getTemplateAddress();
    }
}
