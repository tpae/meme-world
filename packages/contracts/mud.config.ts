import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  tables: {
    Creator: "address",
    Name: "string",
    PathKey: "bytes32",
    Path: "uint256[]",
    Minted: "bool",
    TemplateIdIncrement: {
      keySchema: {},
      valueSchema: "uint256"
    },
    DerivativeIncrement: {
      keySchema: {},
      valueSchema: "uint256"
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PathKey")],
    },
    {
      name: "UniqueEntityModule",
      root: true
    }
  ]
});
