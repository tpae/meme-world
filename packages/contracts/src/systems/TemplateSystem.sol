// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {System} from "@latticexyz/world/src/System.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {PackedCounter} from "@latticexyz/store/src/PackedCounter.sol";
import {getKeysWithValue} from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import {getUniqueEntity} from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import {Media, Name, Creator, TemplateIncrement, Path, PathKeyTableId, PathKey} from "../codegen/index.sol";
import {templateIdToEntityKey} from "../entityKey.sol";

contract TemplateSystem is System {
    function createTemplate(string calldata name) public returns (uint256) {
        uint256 templateId = TemplateIncrement.get();
        bytes32 entityKey = templateIdToEntityKey(templateId);

        Creator.set(entityKey, _msgSender());
        Name.set(entityKey, name);
        TemplateIncrement.set(templateId + 1);

        return templateId;
    }

    function drawPath(uint256 templateId, uint128[][] calldata paths) public {
        bytes32 entityKey = templateIdToEntityKey(templateId);
        require(Creator.get(entityKey) == _msgSender(), "not the creator");

        bytes32 pathKey = getUniqueEntity();
        Path.set(pathKey, getPackedPaths(paths));
        PathKey.set(pathKey, entityKey);
    }

    function mintTemplate(string calldata name, string calldata media) public {
        uint256 tokenId = TemplateIncrement.get();
        bytes32 entityKey = templateIdToEntityKey(tokenId);

        Creator.set(entityKey, _msgSender());
        Name.set(entityKey, name);
        Media.set(entityKey, media);
    }

    function templateTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes32 entityKey = templateIdToEntityKey(tokenId);
        string memory name = Name.get(entityKey);
        string memory image = generateSVGPaths(entityKey);
        bytes memory svg = abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<?xml version="1.0" encoding="UTF-8"?>',
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 420 420" width="420" height="420">',
                        image,
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
                            svg,
                            '", "description": "This can be used on memeworld.lol to create your own memes"}'
                        )
                    )
                )
            )
        );
    }

    function generateSVGPaths(bytes32 entityKey) internal view returns (string memory) {
        (bytes memory x, PackedCounter counter, bytes memory y) = PathKey.encode(entityKey);
        bytes32[] memory keysWithValue = getKeysWithValue(PathKeyTableId, x, counter, y);
        uint256 totalPaths = keysWithValue.length;

        string memory output = "";
        for (uint256 i = 0; i < totalPaths; i++) {
            uint256[] memory path = Path.get(keysWithValue[i]);
            output = string(abi.encodePacked(output, svgPath(generateSVGPath(path))));
        }

        return svgGroup(output);
    }

    function generateSVGPath(uint256[] memory path) internal pure returns (string memory) {
        uint256 totalPoints = path.length;

        if (totalPoints == 1) {
            (uint128 x, uint128 y) = unpack(path[0]);
            return svgCircle(x, y);
        }

        string memory output = "";
        for (uint256 i = 0; i < totalPoints; i++) {
            if (i == 0) {
                (uint128 x, uint128 y) = unpack(path[0]);
                output = string(
                    abi.encodePacked(
                        output,
                        string(
                            abi.encodePacked("M ", floatize(x), ",", floatize(y), " ", svgPackCurve(x, y, x, y, x, y))
                        )
                    )
                );
            } else {
                (uint128 prevX, uint128 prevY) = unpack(path[i - 1]);
                (uint128 currX, uint128 currY) = unpack(path[i]);
                output = string(abi.encodePacked(output, svgPackCurve(prevX, prevY, currX, currY, currX, currY)));
            }
        }

        return output;
    }

    function svgPackCurve(uint256 sX, uint256 xY, uint256 eX, uint256 eY, uint256 pointX, uint256 pointY)
        internal
        pure
        returns (string memory)
    {
        return string(
            abi.encodePacked(
                "C ",
                floatize(sX),
                ",",
                floatize(xY),
                " ",
                floatize(eX),
                ",",
                floatize(eY),
                " ",
                floatize(pointX),
                ",",
                floatize(pointY)
            )
        );
    }

    function svgPath(string memory d) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<path d="', d, '" fill="none" stroke-linecap="round" stroke="#000000" stroke-width="4"></path>'
            )
        );
    }

    function svgGroup(string memory children) internal pure returns (string memory) {
        return string(abi.encodePacked("<g>", children, "</g>"));
    }

    function svgCircle(uint256 cx, uint256 cy) internal pure returns (string memory) {
        return string(abi.encodePacked('<circle cx="', floatize(cx), '" cy="', floatize(cy), '"></circle>'));
    }

    function floatize(uint256 number) public pure returns (string memory) {
        return Strings.toString(number);
    }

    function pack(uint128 a, uint128 b) public pure returns (uint256) {
        return (uint256(a) << 128) | uint256(b);
    }

    function unpack(uint256 packed) public pure returns (uint128 a, uint128 b) {
        a = uint128(packed >> 128);
        b = uint128(packed);
    }

    function getPackedPaths(uint128[][] calldata paths) public pure returns (uint256[] memory packedPaths) {
        uint256 pathsLength = paths.length;
        packedPaths = new uint256[](pathsLength);

        for (uint256 i = 0; i < pathsLength; i++) {
            uint128[] calldata path = paths[i];
            packedPaths[i] = pack(path[0], path[1]);
        }
    }
}
