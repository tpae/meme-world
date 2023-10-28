// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {System} from "@latticexyz/world/src/System.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {PackedCounter} from "@latticexyz/store/src/PackedCounter.sol";
import {getKeysWithValue} from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import {Path, PathKeyTableId, PathKey} from "./codegen/index.sol";

contract DrawableSystem is System {
    function generateSVGPaths(bytes32 entityKey) internal view returns (string memory) {
        (bytes memory x, PackedCounter counter, bytes memory y) = PathKey.encode(entityKey);
        bytes32[] memory keysWithValue = getKeysWithValue(PathKeyTableId, x, counter, y);
        uint256 totalPaths = keysWithValue.length;

        string memory output = "";
        for (uint256 i = 0; i < totalPaths; i++) {
            uint256[] memory path = Path.get(keysWithValue[i]);
            output = string(abi.encodePacked(output, generateSVGPath(path)));
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
                        string(abi.encodePacked("M ", floatize(x), ",", floatize(y), " ", packCurve(x, y, x, y, x, y)))
                    )
                );
            } else {
                (uint128 prevX, uint128 prevY) = unpack(path[i - 1]);
                (uint128 currX, uint128 currY) = unpack(path[i]);
                output = string(abi.encodePacked(output, packCurve(prevX, prevY, currX, currY, currX, currY)));
            }
        }

        return svgPath(output);
    }

    function packCurve(uint256 sX, uint256 xY, uint256 eX, uint256 eY, uint256 pointX, uint256 pointY)
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

    function svgCircle(uint256 x, uint256 y) internal pure returns (string memory) {
        return string(abi.encodePacked('<circle cx="', floatize(x), '" cy="', floatize(y), '"></circle>'));
    }

    function floatize(uint256 number) internal pure returns (string memory) {
        return Strings.toString(number);
    }

    function pack(uint128 a, uint128 b) internal pure returns (uint256) {
        return (uint256(a) << 128) | uint256(b);
    }

    function unpack(uint256 packed) internal pure returns (uint128 a, uint128 b) {
        a = uint128(packed >> 128);
        b = uint128(packed);
    }

    function getPackedPaths(uint128[][] calldata paths) internal pure returns (uint256[] memory packedPaths) {
        uint256 pathsLength = paths.length;
        packedPaths = new uint256[](pathsLength);

        for (uint256 i = 0; i < pathsLength; i++) {
            uint128[] calldata path = paths[i];
            packedPaths[i] = pack(path[0], path[1]);
        }
    }
}
