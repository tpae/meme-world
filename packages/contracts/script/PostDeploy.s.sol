// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {StoreSwitch} from "@latticexyz/store/src/StoreSwitch.sol";
import {IWorld} from "../src/codegen/world/IWorld.sol";
import {GameConfig} from "../src/codegen/index.sol";
import {MemeWorld} from "../src/MemeWorld.sol";
import {MemeWorldTemplates} from "../src/MemeWorldTemplates.sol";

contract PostDeploy is Script {
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    function run(address worldAddress) external {
        // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions from the deployer account
        vm.startBroadcast(deployerPrivateKey);

        MemeWorld memeWorld = new MemeWorld(worldAddress);
        MemeWorldTemplates memeWorldTemplates = new MemeWorldTemplates(worldAddress);

        IAccessControl(address(memeWorld)).grantRole(DEFAULT_ADMIN_ROLE, worldAddress);
        IAccessControl(address(memeWorldTemplates)).grantRole(DEFAULT_ADMIN_ROLE, worldAddress);

        StoreSwitch.setStoreAddress(worldAddress);
        GameConfig.set(address(memeWorld), address(memeWorldTemplates));

        vm.stopBroadcast();
    }
}
