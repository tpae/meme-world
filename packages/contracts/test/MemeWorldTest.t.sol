// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
import {MudTest} from "@latticexyz/world/test/MudTest.t.sol";
import {getKeysWithValue} from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";

import {IWorld} from "../src/codegen/world/IWorld.sol";

contract MemeWorldTest is MudTest {
    function testWorldExists() public {
        uint256 codeSize;
        address addr = worldAddress;
        assembly {
            codeSize := extcodesize(addr)
        }
        assertTrue(codeSize > 0);
    }

    function testMintTemplate() public {
        IWorld world = IWorld(worldAddress);
        uint256 templateId = world.createTemplate("foo");

        uint128[] memory path1 = new uint128[](2);
        path1[0] = 420;
        path1[1] = 420;

        uint128[] memory path2 = new uint128[](2);
        path2[0] = 69;
        path2[1] = 69;

        uint128[][] memory paths = new uint128[][](2);
        paths[0] = path1;
        paths[1] = path2;

        world.drawPaths(templateId, paths);

        console.log(world.templateTokenURI(templateId));
    }
}
